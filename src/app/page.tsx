import WalletList from "./components/WalletList";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-8">Portal API Demo</h1>
        <div className="grid grid-cols-1 gap-4">
          <div className="p-4 border rounded-lg">
            <h2 className="text-2xl font-semibold mb-4">Wallets</h2>
            <p className="mb-4">
              Create and manage wallets using the Portal API
            </p>
            <WalletList />
          </div>
        </div>
      </div>
    </main>
  );
}
