import '../css/FeaturesSection.css';
import { HiChartBar, HiSparkles, HiShieldCheck, HiLightningBolt } from 'react-icons/hi';

function FeaturesSection() {

  const features = [
    {
      icon: <HiChartBar />,
      title: 'Multiple Chart Types',
      description: 'Create beautiful bar charts, line charts, burndown charts, and more. Visualize your financial data exactly how you want.'
    },
    {
      icon: <HiLightningBolt />,
      title: 'Real-time Notion Sync',
      description: 'Seamlessly connect to your Notion databases. Updates reflect instantly, keeping your insights always up-to-date.'
    },
    {
      icon: <HiSparkles />,
      title: 'Fully Customizable',
      description: 'Customize colors, time ranges, categories, and display options. Make every chart perfectly match your needs.'
    },
    {
      icon: <HiShieldCheck />,
      title: 'Privacy First',
      description: 'Your financial data stays secure. We never store your data permanently—everything syncs directly with your Notion.'
    }
  ];

  return (
    <section className='features-section' id='features'>
      <div className='features-container'>
        <div className='features-header'>
          <h2>Everything you need to visualize your finances</h2>
          <p>Powerful features designed to make financial tracking effortless and insightful</p>
        </div>

        <div className='features-grid'>
          {features.map((feature, index) => (
            <div className='feature-card' key={index}>
              <div className='feature-icon'>
                {feature.icon}
              </div>
              <h3>{feature.title}</h3>
              <p>{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default FeaturesSection;

