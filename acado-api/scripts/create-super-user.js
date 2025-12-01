/*
 * Create or update a super admin user directly from the Mongo shell.
 *
 * Usage example:
 *   mongo acedodb scripts/create-super-user.js --eval 'email="admin@example.com"; password="ChangeMe123"; name="Super Admin";'
 *
 * Provide either:
 *   - password (plaintext; hashed in script with SHA-256 fallback) OR
 *   - passwordHash (pre-hashed with bcrypt or your preferred algorithm)
 */

if (typeof db === "undefined") {
  throw new Error("This script must be run inside mongo/mongosh (db is undefined).");
}

var email = typeof email !== "undefined" ? email : "superadmin@gmail.com";
var password = typeof password !== "undefined" ? password : "12345678";
var passwordHash = typeof passwordHash !== "undefined" ? passwordHash : null;
var name = typeof name !== "undefined" ? name : "Super Admin";

var ROLE_NAME = typeof roleName !== "undefined" ? roleName : "superadmin";

if (!password && !passwordHash) {
  throw new Error("Provide either password or passwordHash via --eval.");
}

function ensureRole() {
  var existing = db.roles.findOne({ name: ROLE_NAME });
  if (existing) {
    print("✓ Role '" + ROLE_NAME + "' already exists.");
    return existing._id;
  }
  var now = new Date();
  var roleDoc = {
    name: ROLE_NAME,
    description: "Full access to the system",
    permissions: ["*"],
    createdAt: now,
    updatedAt: now,
  };
  var res = db.roles.insertOne(roleDoc);
  print("✓ Created role '" + ROLE_NAME + "'.");
  return res.insertedId;
}

function hashPassword(plain) {
  if (!plain) return null;

  if (typeof require === "function") {
    var crypto = require("crypto");
    var hash = crypto.createHash("sha256").update(plain).digest("hex");
    print("⚠️  Password hashed using SHA-256 fallback. Supply passwordHash for stronger hashing.");
    return hash;
  }

  // mongosh supports global crypto
  if (typeof crypto !== "undefined" && crypto.subtle) {
    var data = new TextEncoder().encode(plain);
    var digest = crypto.subtle.digest("SHA-256", data);
    var hashHex = Array.from(new Uint8Array(digest))
      .map(function (b) {
        return ("00" + b.toString(16)).slice(-2);
      })
      .join("");
    print("⚠️  Password hashed using SHA-256 fallback. Supply passwordHash for stronger hashing.");
    return hashHex;
  }

  throw new Error("No hashing capability available. Provide passwordHash.");
}

function ensureUser(roleId) {
  var now = new Date();
  var existing = db.users.findOne({ email: email });
  var finalHash = passwordHash || hashPassword(password);

  var firstName = name.split(" ")[0];
  var lastName = name.split(" ").slice(1).join(" ");

  var userDoc = {
    email: email,
    password: finalHash,
    firstName: firstName,
    lastName: lastName,
    roles: [roleId],
    isActive: true,
    isVerified: true,
    createdAt: existing ? existing.createdAt : now,
    updatedAt: now,
  };

  if (existing) {
    db.users.updateOne(
      { _id: existing._id },
      { $set: userDoc }
    );
    print("✓ Updated existing user '" + email + "'.");
  } else {
    db.users.insertOne(userDoc);
    print("✓ Created new user '" + email + "'.");
  }
}

print("🚀 Creating super admin user...");
var roleId = ensureRole();
ensureUser(roleId);
print("✅ Super admin setup complete.");

