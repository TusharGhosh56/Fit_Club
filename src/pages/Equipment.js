import '../css/Equipment.css';

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
    </div>
  );
}

export default Equipment;