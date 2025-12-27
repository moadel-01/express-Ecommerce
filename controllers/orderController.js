const { Order } = require("../models/order");
const { User } = require("../models/user");

async function createOrder(req, res) {
  try {
    const customer = {
      customer_id: req.user.id,
      email: req.user.email,
      username: req.user.username,
    };

    const { cartProducts, totalPrice } = req.body;

    const order = await Order.create({
      customer: customer,

      products: cartProducts.map((item) => ({
        prod_id: item.prod_id,
        title: item.title,
        price: item.price,
        quantity: item.quantity,
        thumbnail: item.thumbnail,
      })),

      totalPrice: totalPrice,
    });

    res
      .status(200)
      .json({ message: "order created successfully", data: order });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function getOrders(req, res) {
  try {
    const orders = await Order.find();

    res.status(200).json({ message: "all users Orders", data: orders });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function getSingleOrder(req, res) {
  try {
    const { customer_id, id } = req.params;
    const user = req.user;

    const customer = await User.findById(customer_id);
    if (!customer) {
      return res.status(404).json({ message: "user not found" });
    }

    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ message: "order not found" });
    }

    const orderOwner = order.customer.customer_id.toString();
    const reqUser = user.id;

    if (customer_id !== reqUser && user.role !== "ADMIN") {
      return res.status(400).json({ message: "bad request!" });
    }

    if (orderOwner !== reqUser && user.role !== "ADMIN") {
      return res
        .status(401)
        .json({ message: "you do not have the access to veiw these orders" });
    }

    res.status(200).json({
      message: `your order ( ${id} ) here is order summary: `,
      data: order,
    });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
}

async function getAllUserOrders(req, res) {
  try {
    const { customer_id } = req.params;
    const user = req.user;

    const userReq = await User.findById(customer_id);
    if (!userReq) {
      return res.status(404).json({ message: "user not found" });
    }

    console.log(userReq);

    if (customer_id !== user.id && user.role !== "ADMIN") {
      return res
        .status(401)
        .json({ message: "you do not have the access to view these orders" });
    }

    const userOrders = await Order.find({
      "customer.customer_id": customer_id,
    });
    // console.log(userOrders);
    if (user.role == "USER") {
      res.status(200).json({
        message: `hey ${user.username}, all your orders`,
        data: userOrders,
      });
    }

    if (user.role == "ADMIN") {
      res.status(200).json({
        message: `all ${userReq.username}'s orders`,
        data: userOrders,
      });
    }
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
}

module.exports = { createOrder, getOrders, getSingleOrder, getAllUserOrders };
