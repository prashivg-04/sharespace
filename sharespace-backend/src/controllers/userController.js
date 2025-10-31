import User from '../models/User.js';

export async function getMe(req, res, next) {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });
    return res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        profilePictureUrl: user.profilePictureUrl,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    return next(error);
  }
}

export async function updateMe(req, res, next) {
  try {
    const { name, bio } = req.body || {};
    // Accept multiple client keys for profile picture for compatibility
    const profilePictureUrl =
      req.body?.profilePictureUrl ?? req.body?.profilePic ?? req.body?.profilePicture ?? null;

    const update = {};
    if (typeof name === 'string') update.name = name.trim();
    if (typeof bio === 'string') update.bio = bio.trim();
    if (typeof profilePictureUrl === 'string' || profilePictureUrl === null) update.profilePictureUrl = profilePictureUrl;

    if (update.name !== undefined && update.name.length === 0) {
      return res.status(400).json({ message: 'Name cannot be empty' });
    }
    if (update.bio !== undefined && update.bio.length > 500) {
      return res.status(400).json({ message: 'Bio must be less than 500 characters' });
    }

    const user = await User.findByIdAndUpdate(req.userId, { $set: update }, {
      new: true,
      runValidators: true,
    });
    if (!user) return res.status(404).json({ message: 'User not found' });

    return res.status(200).json({
      message: 'Profile updated successfully',
      user: {
        id: user._id,
        name: update.name,
        email: user.email,
        bio: update.bio,
        profilePictureUrl: update.profilePictureUrl ?? user.profilePictureUrl,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    return next(error);
  }
}


