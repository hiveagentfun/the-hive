import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import StatsBar from "@/components/StatsBar";
import LiveFeed from "@/components/LiveFeed";
import DeployedTokens from "@/components/DeployedTokens";
import BuybackTracker from "@/components/BuybackTracker";
import TwitterFeed from "@/components/TwitterFeed";
import WalletOverview from "@/components/WalletOverview";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <StatsBar />
        <LiveFeed />
        <DeployedTokens />
        <BuybackTracker />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          <TwitterFeed />
          <WalletOverview />
        </div>
      </main>
      <Footer />
    </>
  );
}
