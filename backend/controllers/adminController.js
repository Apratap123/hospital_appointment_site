
import validator from 'validator'
import bcrypt from 'bcrypt'
import {v2 as cloudinary} from "cloudinary"
import doctorModel from '../models/doctorModel.js'
import jwt from 'jsonwebtoken'
import appointmentModel from '../models/appointmentModel.js'
import userModel from '../models/userModel.js'

// API for adding doctors

const addDoctor = async (req,res) => {
    try{
        const {name, email, password, speciality, degree, experience, about, fees, address} = req.body
        const imageFile = req.file
        
    // checking for the data to add doctors

    if(!name || !email || !password ||  !speciality || !degree || !experience || !about || !fees || !address) {
        return res.json({succuss:false, message: "Missing Details"})
    }

    // validate email format
    if (!validator.isEmail(email)) {
        return res.json({succuss:false, message: "Please enter a valid E-mail"})
    }

    // validating strong password
    if(password.length <8) {
        return res.json({succuss:false, message: "Please enter a strong password"})
    }

    //hashing doctor password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password,salt)
    
    //upload image to cloudinary
    const imageUpload = await cloudinary.uploader.upload(imageFile.path, {resource_type:"image"})
    const imageUrl = imageUpload.secure_url

    const doctorData = {
        name,
        email,
        image:imageUrl,
        password:hashedPassword,
        speciality,
        degree,
        experience,
        about,
        fees,
        address:JSON.parse(address),
        date:Date.now()
    }

    const newDoctor = new doctorModel(doctorData)
    await newDoctor.save()
    res.json({success:true,message:"Doctor added"})

    } catch (error) {
        console.log(error);
        res.status(500).json({success:false,message:error.message })
    }
}

//api for admin login
const loginAdmin = async (req,res) => {
    try {
        const {email,password} = req.body;

        if(email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            
            const token = jwt.sign(email+password,process.env.JWT_SECRET)
            res.json({success:true,token})

        }else {
            res.json({success:false,message:"Invalid Credentials"})
        }
    }catch (error) {
        console.log(error);
        res.status(500).json({success:false,message:error.message })
    }
};

//api to get all doctor list for admin panel
const allDoctors = async (req,res) => {
    try {
        const doctors = await doctorModel.find({}).select('-password')
        res.json({success:true, doctors})

    } catch (error) {
        console.log(error);
        res.status(500).json({success:false,message:error.message })
        
    }
}

//api to get all appointment list
const appointmentsAdmin = async (req,res)=>{
    try {
        const appointments = await appointmentModel.find({})
        res.json({success:true, appointments})
    } catch (error) {
        console.log(error);
        res.status(500).json({success:false,message:error.message })
    }
}

//Api for appointment cancellation
const appointmentCancel = async (req, res) => {
    try {
        const { appointmentId } = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)

        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true })

        // releasing doctor slot
        const { docId, slotDate, slotTime } = appointmentData

        const doctorData = await doctorModel.findById(docId)

        let slots_booked = doctorData.slots_booked

        slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime)

        await doctorModel.findByIdAndUpdate(docId, { slots_booked })

        res.json({ success: true, message: "Appointment Cancelled" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })

    }
}

//api to get dashboard data for admin panel

const adminDashboard = async (req,res)=>{
    try {
        
        const doctors = await doctorModel.find({})
        const users = await userModel.find({})
        const appointments = await appointmentModel.find({})

        const dashData = {
            doctors:doctors.length,
            appointments:appointments.length,
            patients:users.length,
            latestAppointments: appointments.reverse().slice(0,5)

        }

        res.json({success:true,dashData})

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })

    }
}

export {addDoctor,loginAdmin,allDoctors,appointmentsAdmin, appointmentCancel, adminDashboard};































// import validator from 'validator';
// import bcrypt from 'bcrypt';
// import { v2 as cloudinary } from 'cloudinary';
// import doctorModel from '../models/doctorModel.js';
// import jwt from 'jsonwebtoken';

// // API for adding doctors
// const addDoctor = async (req, res) => {
//     try {
//         const { name, email, password, speciality, degree, experience, about, fees, address } = req.body;
//         const imageFile = req.file;

//         // Validate required fields
//         if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address) {
//             return res.status(400).json({ success: false, message: "Missing details" });
//         }

//         // Validate email format
//         if (!validator.isEmail(email)) {
//             return res.status(400).json({ success: false, message: "Invalid email format" });
//         }

//         // Validate password strength
//         if (password.length < 8) {
//             return res.status(400).json({ success: false, message: "Password must be at least 8 characters long" });
//         }

//         // Hash the doctor's password
//         const salt = await bcrypt.genSalt(10);
//         const hashedPassword = await bcrypt.hash(password, salt);

//         // Check if file is uploaded
//         if (!imageFile) {
//             return res.status(400).json({ success: false, message: "Doctor's image is required" });
//         }

//         // Upload image to Cloudinary
//         const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image" });
//         const imageUrl = imageUpload.secure_url;

//         // Parse the address safely
//         let parsedAddress;
//         try {
//             parsedAddress = JSON.parse(address);
//         } catch {
//             return res.status(400).json({ success: false, message: "Invalid address format" });
//         }

//         // Create doctor data
//         const doctorData = {
//             name,
//             email,
//             image: imageUrl,
//             password: hashedPassword,
//             speciality,
//             degree,
//             experience,
//             about,
//             fees,
//             address: parsedAddress,
//             date: Date.now(),
//         };

//         // Save doctor to the database
//         const newDoctor = new doctorModel(doctorData);
//         await newDoctor.save();
//         res.status(201).json({ success: true, message: "Doctor added successfully" });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ success: false, message: error.message });
//     }
// };

// // API for admin login
// const loginAdmin = async (req, res) => {
//     try {
//         const { email, password } = req.body;

//         // Validate admin credentials
//         if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
//             // Create a JWT token with a secure payload
//             const token = jwt.sign(
//                 { email, role: 'admin' },
//                 process.env.JWT_SECRET,
//                 { expiresIn: '1h' } // Token expires in 1 hour
//             );

//             return res.status(200).json({ success: true, token });
//         } else {
//             return res.status(401).json({ success: false, message: "Invalid credentials" });
//         }
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ success: false, message: error.message });
//     }
// };

// export { addDoctor, loginAdmin };
