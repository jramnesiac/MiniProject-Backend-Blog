import Users from "../models/UserModel.js";

const authLoginController = {
  keepLogin: async (req, res) => {
    try {
      const result = await Users.findOne({
        where: {
          id: req.user.id
        }
      });
      const { id, username } = result;
      res.status(200).send({
        id,
        username
      });
    } catch (error) {
      res.status(400).send(error);
    }
  }
};

export default authLoginController;
