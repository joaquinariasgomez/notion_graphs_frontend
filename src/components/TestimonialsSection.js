import '../css/TestimonialsSection.css';
import { FaRedditAlien, FaTwitter, FaProductHunt } from 'react-icons/fa';

function TestimonialsSection() {

  const sourceIcons = {
    reddit: { icon: <FaRedditAlien />, label: 'Reddit', className: 'source-reddit' },
    twitter: { icon: <FaTwitter />, label: 'Twitter', className: 'source-twitter' },
    producthunt: { icon: <FaProductHunt />, label: 'Product Hunt', className: 'source-producthunt' },
    notionCircleCommunity: { icon: <img src="/Notion_community_icon.png" alt="Notion Community" className="source-icon-img" />, label: 'Notion Community', className: 'source-notion' },
    notionTemplates: { icon: <img src="/notion_logo.png" alt="Notion Templates" className="source-icon-img source-icon-img--small" />, label: 'Notion Templates', className: 'source-notion' }
  };

  const testimonials = [
    {
      name: 'Lionel Lakson',
      quote: 'NotionWallet is a smart and elegant way to turn existing Notion data into meaningful financial insights.',
      profilePic: '/lionel_lakson_profile_pic.jpeg',
      source: 'reddit'
    },
    {
      name: "Thais Gutiérrez",
      quote: 'Ayuda mucho a organizar mis gastos, consumos, ingresos y extras.',
      avatar: 'T',
      source: 'notionTemplates'
    },
    {
      name: "Benny Builds It",
      quote: 'Great effort, looks impressive. The advanced chart options do look interesting. Notion users in general love the ability to use Notion to consolidate many tools and apps directly into their Notion workspace.',
      profilePic: '/benny_builds_it_profile_pic.jpeg',
      source: 'notionCircleCommunity'
    },
    {
      name: "Juan Alejandro",
      quote: 'Es increíble las cantidades de formas y cosas que puedes hacer aqui, y estoy feliz de descubrirla.',
      avatar: 'J',
      source: 'notionTemplates'
    },
    {
      name: 'Michael K',
      quote: 'Finally, a tool that works the way I think. The burndown charts are perfect for tracking my monthly budget goals.',
      avatar: 'M',
      source: 'reddit'
    },
    {
      name: 'David P  ',
      quote: 'Clean interface, powerful features. Exactly what I needed.',
      avatar: 'D',
      source: 'notionTemplates'
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
                  {testimonial.profilePic ? (
                    <img
                      src={testimonial.profilePic}
                      alt={testimonial.name}
                      className='testimonial-avatar-img'
                    />
                  ) : (
                    <div className='testimonial-avatar'>
                      {testimonial.avatar}
                    </div>
                  )}
                  <div className='testimonial-info'>
                    <span className='testimonial-name'>{testimonial.name}</span>
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

        <div className='producthunt-review-cta'>
          <p>Want to be in this wall? We'd love to hear from you!</p>
          <a
            href="https://www.producthunt.com/products/notion-wallet/reviews/new?utm_source=badge-product_review&utm_medium=badge&utm_source=badge-notion-wallet"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              src="https://api.producthunt.com/widgets/embed-image/v1/product_review.svg?product_id=1135377&theme=light"
              alt="Notion Wallet - Control your digital wallet by using your Notion data | Product Hunt"
              width="250"
              height="54"
            />
          </a>
        </div>
      </div>
    </section>
  );
}

export default TestimonialsSection;

