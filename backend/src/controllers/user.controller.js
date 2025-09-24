
export const getProfile = async (req, res) => {
    // req.user inyectado por auth middleware
    res.json({ user: req.user });
};

export const updateProfile = async (req, res, next) => {
    try {
        const updates = {};
        if (req.body.name) updates.name = req.body.name;
        if (req.body.email) updates.email = req.body.email; // en prod validar único
        const user = await req.user.constructor.findByIdAndUpdate(req.user._id,
            updates, { new: true }).select('-password');
        res.json({ user });
    } catch (err) {
        next(err);
    }
}