import jwt from "jsonwebtoken";
import nodeMailer from "nodemailer";
import smtpTransport from "nodemailer-smtp-transport";

export const generateToken = (user) => {
  return jwt.sign(
    {
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "30d",
    }
  );
};

export const isAuth = (req, res, next) => {
  const authorization = req.headers.authorization;
  if (authorization) {
    const token = authorization.slice(7, authorization.length); // Bearer XXXXXX

    jwt.verify(token, process.env.JWT_SECRET, (err, decode) => {
      if (err) {
        res.status(401).send({ message: "Invalid Token" });
      } else {
        req.user = decode;
        next();
      }
    });
  } else {
    res.status(401).send({ message: "No Token" });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user && req.user.isAdmin) {
    next();
  } else {
    res.status(401).send({ message: "Invalid Admin Token" });
  }
};

const transporterDetails = smtpTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "mahdi.daee.futsal.goal.keeper.84.ch@gmail.com",
    pass: "yaotntxtidowcvca",
  },
  tls: {
    rejectUnauthorized: false,
  },
});

const transporter = nodeMailer.createTransport(transporterDetails);

const options = {
  from: "mahdi.daee.futsal.goal.keeper.84.ch@gmail.com",
  to: "mahdi.daee.ch@gmail.com",
  subject: "Nodemailer Test",
  text: "Simple Test Of Nodemailer",
};

// transporter.sendMail(options, (err, info) => {
//   if (err) return console.log(err);
//   console.log(info);
// });

export const sendEmail = (email, subject, order) => {
  const transporter = nodeMailer.createTransport(transporterDetails);
  transporter.sendMail({
    from: "toplearn@ghorbany.dev",
    to: email,
    subject: subject,
    html: `<h1>Thanks for shopping with us</h1>
    <p>
    Hi ${order.user.name},</p>
    <p>We have finished processing your order.</p>
    <h2>[Order ${order._id}] (${order.createdAt
      .toString()
      .substring(0, 10)})</h2>
    <table>
    <thead>
    <tr>
    <td><strong>Product</strong></td>
    <td><strong>Quantity</strong></td>
    <td><strong align="right">Price</strong></td>
    </thead>
    <tbody>
    ${order.orderItems
      .map(
        (item) => `
      <tr>
      <td>${item.name}</td>
      <td align="center">${item.quantity}</td>
      <td align="right"> $${item.price.toFixed(2)}</td>
      </tr>
    `
      )
      .join("\n")}
    </tbody>
    <tfoot>
    <tr>
    <td colspan="2">Items Price:</td>
    <td align="right"> $${order.itemsPrice.toFixed(2)}</td>
    </tr>
    <tr>
    <td colspan="2">Shipping Price:</td>
    <td align="right"> $${order.shippingPrice.toFixed(2)}</td>
    </tr>
    <tr>
    <td colspan="2"><strong>Total Price:</strong></td>
    <td align="right"><strong> $${order.totalPrice.toFixed(2)}</strong></td>
    </tr>
    <tr>
    <td colspan="2">Payment Method:</td>
    <td align="right">${order.paymentMethod}</td>
    </tr>
    </table>
  
    <h2>Shipping address</h2>
    <p>
    ${order.shippingAddress.fullName},<br/>
    ${order.shippingAddress.address},<br/>
    ${order.shippingAddress.city},<br/>
    ${order.shippingAddress.country},<br/>
    ${order.shippingAddress.postalCode}<br/>
    </p>
    <hr/>
    <p>
    Thanks for shopping with us.
    </p>
    `,
  });
};
