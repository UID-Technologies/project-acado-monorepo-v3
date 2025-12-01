export default function NewsHeader() {
  return (
    <header className="text-left mb-4">
      <p className="text-sm uppercase tracking-wider text-white-600 mb-4">
        Welcome to bulletin
      </p>
      <h1 className="text-3xl font-bold">
        Craft narratives{" "}
        <span className="inline-flex items-center">
          ✍️ that {" "}
          <span className="dark:text-green-500 mx-1">inspiration</span> ⚡,
        </span>
        <br />
        <span className="inline-flex items-center">
          <span className="dark:text-green-500 mr-1">enlighten</span> 📚, and{" "}
          <span className="dark:text-green-500 mx-1">minds for lifelong learning.</span>
        </span>
      </h1>
    </header>
  )
}

