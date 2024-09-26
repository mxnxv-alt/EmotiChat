const UserModel = require("../models/UserModel");
const bcryptjs = require('bcryptjs');
const jwt = require('jsonwebtoken');

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

        const cookieOptions = {
            httpOnly: true,
            secure: true,
            sameSite: 'Strict',
            maxAge: 24 * 60 * 60 * 1000 // 1 day in milliseconds
        };
         
        // Send the token in both the response body and as a cookie
        return response
            .cookie('token', token, cookieOptions)
            .status(200)
            .json({
                message: "Login successful",
                success: true,
                data: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    token: token
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
