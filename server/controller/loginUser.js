const UserModel = require("../models/UserModel");
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken')

async function loginUser(request, response) {
    try {
        const { email, password } = request.body;

        const user = await UserModel.findOne({ email });

        if (!user) {
            return response.status(400).json({
                message: "User does not exist",
                error: true
            });
        }

        const isMatch = await bcryptjs.compare(password, user.password);

        if (!isMatch) {
            return response.status(400).json({
                message: "Incorrect password",
                error: true
            });
        }


  // Generate the JWT token
        const tokenData = {
            id: user._id,
            email: user.email
        };
        const token = await jwt.sign(tokenData, process.env.JWT_SECRET_KEY, { expiresIn: '1d' });

        // Set the cookie options
        const cookieOptions = {
            http: true, 
            secure : true

        };

        return response
            .cookie('token', token, cookieOptions)
            .status(200)
            .json({
                message: "Login successful",
                success: true,
                data: {
                    id: user._id,
                    name: user.name,
                    email: user.email
                }
            });

    } catch (error) {
        return response.status(500).json({
            message: error.message || error,
            error: true
        });
    }
}

module.exports = loginUser;
