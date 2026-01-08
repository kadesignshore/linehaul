const authService = require("../services/auth.service");

exports.register = async (req, res) => {
  try {
    const { user, token } = await authService.register(req.body);

    res.status(201).json({
      message: "User registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.registerDriver = async (req, res) => {
  try {
    const data = { ...req.body, role: "driver" };
    const { user, token } = await authService.registerDriver(data);

    res.status(201).json({
      message: "Driver registered successfully",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    // sleep for 3 seconds to simulate delay
    await new Promise(resolve => setTimeout(resolve, 3000));

    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ message: "username and password required" });
    }

    const { user, token } = await authService.login(username, password);

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        username: user.username,
        role: user.role
      }
    });
  } catch (err) {
    res.status(401).json({ message: err.message });
  }
};


exports.logout = async (req, res) => {
  try {
      // await authService.logout(req.user.id);
    res.json({ message: "Logged out successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getAllDrivers = async (req, res) => {
  try {
    const drivers = await authService.getAllDrivers();
    res.json(drivers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getDriversByName = async (req, res) => {
  try {
    const nameQuery = req.query.name || "";

    const drivers = await authService.getDriversByName(nameQuery);
    res.json(drivers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getDriverById = async (req, res) => {
  try {
    const driverId = req.params.id;
    const driver = await authService.getDriverById(driverId);
    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }
    res.json(driver);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateDriverInfo = async (req, res) => {
  try {
    const driverId = req.params.id;
    const updateData = req.body;
    const updatedDriver = await authService.updateDriverInfo(driverId, updateData);
    res.json({
      message: "Driver information updated successfully",
      driver: updatedDriver
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteDriver = async (req, res) => {
  try {
    const driverId = req.params.id;
    await authService.deleteDriver(driverId);
    res.json({ message: "Driver deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateDriverPassword = async (req, res) => {
  try {
    const driverId = req.params.id;
    const { newPassword } = req.body;
    console.log( req.body)  ;
    await authService.updateDriverPassword(driverId, newPassword);
    res.json({ message: "Driver password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};