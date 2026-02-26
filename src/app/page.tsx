import Navbar from "@/components/Navbar";
import ScrollProgress from "@/components/ScrollProgress";
import Hero from "@/components/Hero";
import Flywheel from "@/components/Flywheel";
import BeehiveTracker from "@/components/BeehiveTracker";
import DeployedTokens from "@/components/DeployedTokens";
import LiveActivity from "@/components/LiveActivity";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <Flywheel />
        <BeehiveTracker />
        <DeployedTokens />
        <LiveActivity />
      </main>
      <Footer />
    </>
  );
}
