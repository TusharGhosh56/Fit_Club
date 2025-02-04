import '../css/Programs.css';

function Equipment() {
  const equipment = [
    {
      name: 'Cardio Zone',
      items: [
        'Treadmills with HD Screens',
        'Elliptical Machines',
        'Rowing Machines',
        'Stationary Bikes',
        'StairMasters'
      ]
    },
    {
      name: 'Strength Training',
      items: [
        'Free Weights (2-50kg)',
        'Smith Machines',
        'Power Racks',
        'Cable Machines',
        'Bench Press Stations'
      ]
    },
    {
      name: 'Functional Training',
      items: [
        'TRX Systems',
        'Kettlebells',
        'Battle Ropes',
        'Medicine Balls',
        'Resistance Bands'
      ]
    },
    {
      name: 'Recovery Zone',
      items: [
        'Foam Rollers',
        'Stretching Area',
        'Massage Chairs',
        'Ice Bath',
        'Sauna'
      ]
    }
  ];

  const programs = [
    {
      name: 'Group Fitness',
      offerings: [
        'HIIT Classes',
        'Spinning Sessions',
        'Yoga & Pilates',
        'Zumba & Dance',
        'CrossFit Training'
      ]
    },
    {
      name: 'Personal Training',
      offerings: [
        'One-on-One Sessions',
        'Custom Workout Plans',
        'Nutrition Coaching',
        'Progress Tracking',
        'Body Composition Analysis'
      ]
    },
    {
      name: 'Specialized Programs',
      offerings: [
        'Weight Loss Programs',
        'Muscle Building',
        'Senior Fitness',
        'Pre/Post Natal',
        'Sports Conditioning'
      ]
    },
    {
      name: 'Wellness Services',
      offerings: [
        'Nutrition Workshops',
        'Meditation Classes',
        'Recovery Sessions',
        'Fitness Assessments',
        'Lifestyle Coaching'
      ]
    }
  ];

  return (
    <div className="equipment">
      <h2 className="section-title">Our <span className="highlight">Equipment</span></h2>
      <div className="equipment-grid">
        {equipment.map((zone, index) => (
          <div key={index} className="equipment-card">
            <h3>{zone.name}</h3>
            <ul>
              {zone.items.map((item, idx) => (
                <li key={idx}>{item}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <h2 className="section-title">Our <span className="highlight">Programs</span></h2>
      <div className="programs-grid">
        {programs.map((program, index) => (
          <div key={index} className="program-card">
            <h3>{program.name}</h3>
            <ul>
              {program.offerings.map((offering, idx) => (
                <li key={idx}>{offering}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Equipment;