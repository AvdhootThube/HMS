const crypto = require('crypto')
const moment = require('moment')
const { User } = require("../models/User");

const checkUserId = async (user_id) => {
  let user = await User.findById(user_id);
  return user
};

const checkUser = async (email) => {
  let regex = new RegExp(email, "i");
  let user = await User.findOne({ email: regex });
  if (user) {
    return user;
  }
};

const createCipher = async (text) => {
  try {
    let mykey1 = crypto.createCipher("aes-128-cbc", "saltforpassword");
    let mystr1 = mykey1.update(text, "utf8", "hex");
    mystr1 += mykey1.final("hex");
    return mystr1;
  } catch (error) {
    throw error;
  }
};

const generateOTP = async () => {
  let otp = Math.floor(Math.random() * 900000) + 100000;
  return otp
}

const getOTP = async (userEmail) => {
  try {
    otp = await User.findOne({ email: userEmail}, 'otp')
    return otp
  } catch (error) {
    throw error
  }
}

const updateOTP = async (userEmail) => {
  let newOTP = await generateOTP()
  try {
    await User.findOneAndUpdate({ email: userEmail }, { otp: newOTP })
    return newOTP
  } catch (error) {
    throw error
  }
}

const addPatient = async (userDetails, pass) => {
  var userObject = {
    name: userDetails.name,
    email: userDetails.email,
    mobileNo: userDetails.mobileNo,
    role: userDetails.role,
    address: userDetails.address,
    dob: userDetails.dob,
    password: pass,
  };
  try {
    const user = new User(userObject);
    await user.save();
    return userObject;
  } catch (error) {
    throw error;
  }
};

const addDoctor = async (userDetails, pass) => {
  var userObject = {
    name: userDetails.name,
    email: userDetails.email,
    mobileNo: userDetails.mobileNo,
    role: userDetails.role,
    password: pass,
    department: userDetails.dept
  };
  try {
    const user = new User(userObject);
    await user.save();
    return userObject;
  } catch (error) {
    throw error;
  }
};

const checkUserPass = async (email, password) => {
  try {
    let regex = new RegExp(email, "i");
    let user = await User.findOne({ email: regex, password: password });
    if (user) {
      return user;
    }
  } catch (error) {
    throw error;
  }
};

// Edit Profile Page
const updateProfile = async (email, userDetails) => {
  var profileChangeObj = {
      name: userDetails.name,
      mobileNo: userDetails.mobileNo,
      dob: userDetails.dob,
      address: userDetails.address
  }
  await User.findOneAndUpdate({ email: email }, profileChangeObj)
}

const validateDOB = async (dob) => {
  const DOBRegex = new RegExp('^[0-9]{2}[\/]{1}[0-9]{2}[\/]{1}[0-9]{4}')
  return DOBRegex.test(dob)
}

const validateMobileNo = async (mobile_no) => {
  const MobNoRegex = new RegExp('^[1-9]{1}[0-9]{9}')
  return MobNoRegex.test(mobile_no)
}

const getDate = async () => {
  var date = new Date()
  return moment(date).format('DD/MM/YYYY hh:mm a')
}

const DOBToAge = async (dob) => {
  if (dob == '' || dob == null) {
      var age = 'Not Provided'
      return age
  }
  var todaysDate = new Date()
  var year = todaysDate.getFullYear()
  var dobYear = moment(dob, 'DD/MM/YYYY hh:mm a').year()
  var dobMonth = moment(dob, 'DD/MM/YYYY hh:mm a').month()
  var dobDate = moment(dob, 'DD/MM/YYYY hh:mm a').date()
  age = year - dobYear
  var m = todaysDate.getMonth() - dobMonth;
  if (m < 0 || (m === 0 && todaysDate.getDate() < dobDate)) {
      age--;
  }
  return age;
}

// Change Password
const changePassword = async (email, newPass) => {
  await User.findOneAndUpdate({ email: email }, { password: newPass })
}


module.exports = {
  checkUserId,
  checkUser,
  createCipher,
  addPatient,
  addDoctor,
  checkUserPass,
  getOTP,
  updateOTP,
  updateProfile,
  validateDOB,
  validateMobileNo,
  getDate,
  DOBToAge,
  changePassword
};
