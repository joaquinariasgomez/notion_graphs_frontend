import './css/LandingPage.css';

function DemoVideoSection() {

  return (
    <section className="demo-video-section" id='demo'>
      <h2 className="demo-video-title">See how it works</h2>
      <p className="demo-video-subtitle">Watch a quick demo to get started in minutes</p>
      <div className="demo-video-wrapper">
        <iframe
          src="https://www.youtube.com/embed/PDEIEdJ0VHY?si=THtFMZ4PG1owrPYi"
          title="NotionWallet Demo Video"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        ></iframe>
      </div>
    </section>
  );
}

export default DemoVideoSection;

