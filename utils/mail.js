
const nodemailer = require("nodemailer");
module.exports = async (receiver, subject, link) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            // TODO: replace `user` and `pass` values from <https://forwardemail.net>
            user: process.env.EMAIL,
            pass: process.env.PASSWORD
        }
    });
    console.log(process.env.EMAIL,process.env.PASSWORD)
    try {
        const info = await transporter.sendMail({
            from: "arksinc", // sender address
            to: receiver, // list of receivers
            subject: `${subject} from Arksinc`, // Subject line
            text: "follow this link to complete the process", // plain text body
            html: `<b> 
            <p>follow this link to complete ${subject} process from Arksinc</p>
            <a href=${link}>click here</a>
            </b>`, // html body
        });
        console.log(info)
        return info

    } catch (err) {
        console.log(err)
        return;
    }

}