export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col w-full h-full items-center justify-start">
      <div className="w-full">
        {children}
      </div>
    </section>
  );
}
