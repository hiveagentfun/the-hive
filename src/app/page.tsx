import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import StatsBar from "@/components/StatsBar";
import DeployedTokens from "@/components/DeployedTokens";
import LiveFeed from "@/components/LiveFeed";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <StatsBar />
        <DeployedTokens />
        <LiveFeed />
      </main>
      <Footer />
    </>
  );
}
