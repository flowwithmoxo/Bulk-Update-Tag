import UploadForm from "@/components/UploadForm";

export default function HomePage() {
  return (
    <main className="min-h-screen px-6 py-16 flex justify-center">
      <div className="w-full max-w-4xl rounded-moxo bg-white p-10 shadow-sm border border-moxo-border">
        <h1 className="text-4xl font-semibold tracking-tight text-moxo-heading">
          Bulk Workspace Tag Update
        </h1>
        <p className="mt-3 text-base text-moxo-body">
          Download a sample CSV, map workspace IDs and tag values, then upload to execute bulk updates seamlessly.
        </p>
        <UploadForm />
      </div>
    </main>
  );
}
