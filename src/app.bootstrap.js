import express from "express";
import { globalErrorHandler } from "./common/utils/response/error.response.js";
import { PORT } from "../config/config.service.js";
import { authenticateDB } from "./DB/db.connection.js";
import { authRouter, userRouter } from "./modules/index.js";
import helmet from "helmet";
import cors from "cors";
import { resolve } from "node:path";
import { connectRedis, redisClient } from "./DB/index.js";
import { get, set } from "./common/services/index.js";
import { sendEmail } from "./common/utils/index.js";

const bootstrap = async () => {
  const app = express();
  app.use(
    express.json(),
    helmet(),
    cors({
      origin: "http://localhost:4200",
    }),
  );
  app.use("/uploads", express.static(resolve(`../uploads`)));

  await authenticateDB();
  await connectRedis();
  // // await sendEmail({
  //   to: "bibo4real123@gmail.com",
  //   cc: ["basselalaa17@gmail.com"],
  //   bcc: ["basselalaa17@gmail.com"],
  //   subject: "test",
  //   html: `<!DOCTYPE html>
  //               <html>
  //               <head>
  //                   <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css"></head>
  //               <style type="text/css">
  //               body{background-color: #88BDBF;margin: 0px;}
  //               </style>
  //               <body style="margin:0px;"> 
  //               <table border="0" width="50%" style="margin:auto;padding:30px;background-color: #F3F3F3;border:1px solid #630E2B;">
  //               <tr>
  //               <td>
  //               <table border="0" width="100%">
  //               <tr>
  //               <td>
  //               <h1>
  //                   <img width="100px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670702280/Group_35052_icaysu.png"/>
  //               </h1>
  //               </td>
  //               <td>
  //               <p style="text-align: right;"><a href="http://localhost:4200/#/" target="_blank" style="text-decoration: none;">View In Website</a></p>
  //               </td>
  //               </tr>
  //               </table>
  //               </td>
  //               </tr>
  //               <tr>
  //               <td>
  //               <table border="0" cellpadding="0" cellspacing="0" style="text-align:center;width:100%;background-color: #fff;">
  //               <tr>
  //               <td style="background-color:#630E2B;height:100px;font-size:50px;color:#fff;">
  //               <img width="50px" height="50px" src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703716/Screenshot_1100_yne3vo.png">
  //               </td>
  //               </tr>
  //               <tr>
  //               <td>
  //               <h1 style="padding-top:25px; color:#630E2B">OTP</h1>
  //               </td>
  //               </tr>
  //               <tr>
  //               <td>
  //               <p style="padding:0px 100px;">
  //               </p>
  //               </td>
  //               </tr>
  //               <tr>
  //               <td>
  //               <p style="margin:10px 0px 30px 0px;border-radius:4px;padding:10px 20px;border: 0;color:#fff;background-color:#630E2B; ">1234</p>
  //               </td>
  //               </tr>
  //               </table>
  //               </td>
  //               </tr>
  //               <tr>
  //               <td>
  //               <table border="0" width="100%" style="border-radius: 5px;text-align: center;">
  //               <tr>
  //               <td>
  //               <h3 style="margin-top:10px; color:#000">Stay in touch</h3>
  //               </td>
  //               </tr>
  //               <tr>
  //               <td>
  //               <div style="margin-top:20px;">

  //               <a href="${process.env.facebookLink}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
  //               <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35062_erj5dx.png" width="50px" hight="50px"></span></a>
                
  //               <a href="${process.env.instegram}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;color:#fff;border-radius:50%;">
  //               <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group35063_zottpo.png" width="50px" hight="50px"></span>
  //               </a>
                
  //               <a href="${process.env.twitterLink}" style="text-decoration: none;"><span class="twit" style="padding:10px 9px;;color:#fff;border-radius:50%;">
  //               <img src="https://res.cloudinary.com/ddajommsw/image/upload/v1670703402/Group_35064_i8qtfd.png" width="50px" hight="50px"></span>
  //               </a>

  //               </div>
  //               </td>
  //               </tr>
  //               </table>
  //               </td>
  //               </tr>
  //               </table>
  //               </body>
  //               </html>`,
  // });


  app.use("/auth", authRouter);
  app.use("/user", userRouter);

  app.use("{/*dummy}", (req, res, next) => {
    return res.status(404).json({
      Message: "Invalid Routing",
    });
  });

  app.use(globalErrorHandler);

  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
};

export default bootstrap;
