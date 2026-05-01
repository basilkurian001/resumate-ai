export default function Skills() {
  const skills = ["SEO", "SEM", "Google Analytics", "Content Marketing"];

  return (
    <div className="sm:col-span-2 bg-white p-4 rounded-xl shadow">
      <h3 className="font-bold mb-3">Skills Detected</h3>

      <div className="flex flex-wrap gap-2">
        {skills.map((skill) => (
          <span
            key={skill}
            className="px-3 py-1 bg-indigo-100 text-indigo-600 rounded-full text-sm"
          >
            {skill}
          </span>
        ))}
      </div>
    </div>
  );
}