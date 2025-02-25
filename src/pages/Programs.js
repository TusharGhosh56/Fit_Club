import '../css/Programs.css';
import { motion } from 'framer-motion';
import cardio from '../assets/programs/cardio.jpg';
import strength from '../assets/programs/strength.jpg';
import functional from '../assets/programs/functional.jpg';
import recovery from '../assets/programs/recovery.jpg';
import group from '../assets/programs/group.jpg';
import wellness from '../assets/programs/wellness.jpg';
import specialized from '../assets/programs/specialized.jpg';
import personal from '../assets/programs/personal.jpg';

function Equipment() {
  const sections = [
    {
      name: 'Cardio Zone',
      description: 'Our Cardio Zone is equipped with state-of-the-art machines designed to enhance endurance and improve heart health. Whether you prefer treadmills with immersive HD screens, elliptical machines, rowing machines, stationary bikes, or stair masters, we have everything you need to elevate your cardio workouts to the next level.',
      image: cardio
    },
    {
      name: 'Strength Training',
      description: 'The Strength Training section provides a variety of free weights, power racks, and specialized equipment to help you build muscle and increase strength. With a range of Smith machines, cable machines, and bench press stations, this area is ideal for both beginners and advanced lifters.',
      image: strength
    },
    {
      name: 'Functional Training',
      description: 'Designed for those looking to improve flexibility, mobility, and core strength, our Functional Training area features TRX systems, kettlebells, battle ropes, and medicine balls. Whether you are training for a specific sport or overall fitness, this space caters to all levels of ability.',
      image: functional
    },
    {
      name: 'Recovery Zone',
      description: 'After an intense workout, our Recovery Zone offers the perfect space to relax and rejuvenate. Equipped with foam rollers, a dedicated stretching area, massage chairs, an ice bath, and a sauna, this area is designed to aid in muscle recovery and overall well-being.',
      image: recovery
    },
    {
      name: 'Group Fitness',
      description: 'Our Group Fitness programs are designed to bring energy and motivation to your workouts. From high-intensity interval training (HIIT) and spinning sessions to yoga, pilates, and dance-based workouts like Zumba, there is something for everyone. Join our CrossFit training classes to push your limits and achieve your fitness goals in a supportive environment.',
      image: group
    },
    {
      name: 'Personal Training',
      description: 'For those looking for individualized coaching, our Personal Training program offers one-on-one sessions with expert trainers. Get customized workout plans, nutrition guidance, and progress tracking to help you achieve your fitness goals. Whether you are looking to build muscle, lose weight, or improve endurance, our trainers are here to support you.',
      image: personal
    },
    {
      name: 'Specialized Programs',
      description: 'We offer specialized fitness programs tailored to different needs. Our weight loss programs focus on sustainable strategies to help you shed unwanted pounds, while muscle-building plans are designed to maximize strength and definition. We also offer senior fitness programs, pre/post-natal training, and sports conditioning for athletes.',
      image: specialized
    },
    {
      name: 'Wellness Services',
      description: 'Achieve holistic well-being with our Wellness Services. We provide nutrition workshops, meditation classes, and recovery sessions to help you balance your fitness journey. Our fitness assessments and lifestyle coaching ensure that you are on the right track towards a healthier lifestyle.',
      image: wellness
    }
  ];

  return (
    <div className="equipment">
      <motion.h2
        className="section-title"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Our <span className="highlight">Key</span> Highlights
      </motion.h2>
      
      {sections.map((section, index) => {
        const words = section.name.split(' '); // Split title into words
        const firstWord = words.shift(); // Extract the first word
        const remainingTitle = words.join(' '); // Join the remaining words

        return (
          <motion.div 
            key={index} 
            className={`equipment-section ${index % 2 === 0 ? 'row' : 'row-reverse'}`}
            initial={{ opacity: 0, y: 100 }}
            whileInView={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: false, amount: 0.5 }}
          >
            <motion.div
              className="text-content"
              initial={{ opacity: 0, x: -100, y: 100 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, x: -100, y: -100 }}
              transition={{ duration: 0.8 }}
            >
              <h3>
                <span className="highlight">{firstWord}</span> {remainingTitle}
              </h3>
              <p>{section.description}</p>
            </motion.div>
            <motion.img
              src={section.image}
              alt={section.name}
              className="equipment-image"
              initial={{ opacity: 0, x: 100, y: 100 }}
              whileInView={{ opacity: 1, x: 0, y: 0 }}
              exit={{ opacity: 0, x: 100, y: -100 }}
              transition={{ duration: 0.8 }}
            />
          </motion.div>
        );
      })}
    </div>
  );
}

export default Equipment;
