import '../css/TestimonialsSection.css';
import { FaRedditAlien, FaTwitter, FaProductHunt } from 'react-icons/fa';

function TestimonialsSection() {

  const sourceIcons = {
    reddit: { icon: <FaRedditAlien />, label: 'Reddit', className: 'source-reddit' },
    twitter: { icon: <FaTwitter />, label: 'Twitter', className: 'source-twitter' },
    producthunt: { icon: <FaProductHunt />, label: 'Product Hunt', className: 'source-producthunt' },
    notion: { icon: <img src="/Notion_community_icon.png" alt="Notion Community" className="source-icon-img" />, label: 'Notion Community', className: 'source-notion' }
  };

  const testimonials = [
    {
      quote: 'NotionWallet is a smart and elegant way to turn existing Notion data into meaningful financial insights.',
      source: 'reddit'
    },
    {
      name: 'Sarah M.',
      role: 'Freelance Designer',
      quote: 'NotionWallet completely changed how I track my finances. The Notion integration is seamless, and the charts are beautiful. I finally have visibility into my spending patterns!',
      avatar: 'S',
      source: 'reddit'
    },
    {
      name: 'Carlos R.',
      role: 'Small Business Owner',
      quote: 'Game-changer for my business finances!',
      avatar: 'C',
      source: 'notion'
    },
    {
      name: 'Emily T.',
      role: 'Product Manager',
      quote: 'Love how everything syncs automatically with my Notion workspace. The customization options are fantastic—I can see exactly what I need without any clutter.',
      avatar: 'E',
      source: 'producthunt'
    },
    {
      name: 'Michael K.',
      role: 'Software Engineer',
      quote: 'Finally, a tool that works the way I think. The burndown charts are perfect for tracking my monthly budget goals.',
      avatar: 'M',
      source: 'reddit'
    },
    {
      name: 'Ana L.',
      role: 'Content Creator',
      quote: 'So intuitive! Been using it for 3 months and I\'ve never had better control over my expenses. The quick entry feature means I actually log everything now instead of forgetting. Highly recommend to anyone who already uses Notion for their life organization.',
      avatar: 'A',
      source: 'twitter'
    },
    {
      name: 'David P.',
      role: 'Startup Founder',
      quote: 'Clean interface, powerful features. Exactly what I needed.',
      avatar: 'D',
      source: 'notion'
    }
  ];

  return (
    <section className='testimonials-section' id='testimonials'>
      <div className='testimonials-container'>
        <div className='testimonials-header'>
          <h2>Loved by Notion users everywhere</h2>
          <p>See what our customers are saying about their experience</p>
        </div>

        <div className='testimonials-grid'>
          {testimonials.map((testimonial, index) => (
            <div className='testimonial-card' key={index}>
              <blockquote className='testimonial-quote'>
                "{testimonial.quote}"
              </blockquote>
              <div className='testimonial-footer'>
                <div className='testimonial-author'>
                  <div className='testimonial-avatar'>
                    {testimonial.avatar}
                  </div>
                  <div className='testimonial-info'>
                    <span className='testimonial-name'>{testimonial.name}</span>
                    <span className='testimonial-role'>{testimonial.role}</span>
                  </div>
                </div>
                <div className={`testimonial-source ${sourceIcons[testimonial.source].className}`}>
                  {sourceIcons[testimonial.source].icon}
                  <span>{sourceIcons[testimonial.source].label}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TestimonialsSection;

