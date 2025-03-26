import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { auth, db } from '../firebase/config';

export const signupUser = async (email, password, name, isTrainer, specialization) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    
    await updateProfile(userCredential.user, {
      displayName: name
    });

    const userData = {
      fullName: name,
      email: email,
      role: isTrainer ? 'Trainer' : 'Member',
      stats: {
        clientsTrained: "0",
        successRate: "0%",
        certifications: "0"
      },
      bio: '',
      phone: '',
      experience: ''
    };

    if (isTrainer && specialization) {
      userData.specialization = specialization;
    }

    await setDoc(doc(db, 'users', userCredential.user.uid), userData);

    return {
      success: true,
      user: userCredential.user
    };
  } catch (error) {
    return {
      success: false,
      error: error.message
    };
  }
};