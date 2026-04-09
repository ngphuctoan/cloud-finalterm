import FileExplorer from "@/components/file-explorer";

export default async function App({
  params,
}: {
  params: Promise<{ id: number }>;
}) {
  const { id } = await params;
  return <FileExplorer parentId={id} />;
}
