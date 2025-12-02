// src/modules/user/user.model.ts
export { 
  default, 
  IUser, 
  UserDocument, 
  UserModel, 
  UserRole,
  IUserMethods
} from '../../models/User.js';

// Re-export default as User for backward compatibility
export { default as User } from '../../models/User.js';

