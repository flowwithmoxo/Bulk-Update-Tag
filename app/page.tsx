import UploadForm from "@/components/UploadForm";

export default function HomePage() {
  return (
    <main className="min-h-screen px-6 py-10">
      <div className="mx-auto max-w-4xl rounded-2xl bg-white p-8 shadow-sm border border-slate-200">
        <h1 className="text-2xl font-semibold">Bulk Workspace Tag Update</h1>
        <p className="mt-2 text-sm text-slate-600">
          Download the sample CSV, fill in workspace IDs and tag values, then upload it to update workspace tags.
        </p>
        <UploadForm />
      </div>
    </main>
  );
}
