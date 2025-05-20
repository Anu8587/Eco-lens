import StoryHero from './components/Hero/StoryHero';

function App() {
  return (
    <div className="min-h-screen bg-[#f3f6f3]">
      <StoryHero />
      <section id="about" className="h-[500px] flex items-center justify-center">
        <h2 className="text-3xl text-[#2e472e] font-inter">About Section</h2>
      </section>
      <section id="contact" className="h-[500px] flex items-center justify-center">
        <h2 className="text-3xl text-[#2e472e] font-inter">Contact Section</h2>
      </section>
    </div>
  );
}

export default App;