// Charger .env depuis la racine du repo si on est dans package/
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { Op } from 'sequelize';
import { sequelize, User, Level, Tank, Plane, Resource } from './models/index.js';

const rootEnv = path.resolve(process.cwd(), '..', '.env');
dotenv.config({ path: rootEnv });
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

const UPLOADS_DIR = path.resolve(process.cwd(), 'backend', 'uploads');
const LEVELS_UPLOADS = path.join(UPLOADS_DIR, 'levels');
const TANKS_UPLOADS = path.join(UPLOADS_DIR, 'tanks');
const PLANES_UPLOADS = path.join(UPLOADS_DIR, 'planes');
const RESOURCES_UPLOADS = path.join(UPLOADS_DIR, 'resources');
if (!fs.existsSync(LEVELS_UPLOADS)) {
  fs.mkdirSync(LEVELS_UPLOADS, { recursive: true });
}
if (!fs.existsSync(TANKS_UPLOADS)) {
  fs.mkdirSync(TANKS_UPLOADS, { recursive: true });
}
if (!fs.existsSync(PLANES_UPLOADS)) {
  fs.mkdirSync(PLANES_UPLOADS, { recursive: true });
}
if (!fs.existsSync(RESOURCES_UPLOADS)) {
  fs.mkdirSync(RESOURCES_UPLOADS, { recursive: true });
}

const ALLOWED_IMAGE_TYPES = ['image/png', 'image/jpeg', 'image/jpg', 'image/gif', 'image/webp'];
const uploadLevelImage = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, LEVELS_UPLOADS),
    filename: (req, file, cb) => {
      const number = req.params.number;
      const ext = (file.originalname && path.extname(file.originalname)) || path.extname(file.mimetype) || '.png';
      cb(null, `level-${number}${ext}`);
    }
  }),
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Type de fichier non autorisé. Utilisez PNG, JPEG, GIF ou WebP.'));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }
});

const uploadTankImage = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, TANKS_UPLOADS),
    filename: (req, file, cb) => {
      const id = req.params.id || req.body?.id || Date.now();
      const ext = (file.originalname && path.extname(file.originalname)) || path.extname(file.mimetype) || '.png';
      cb(null, `tank-${id}-${Date.now()}${ext}`);
    }
  }),
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Type de fichier non autorisé. Utilisez PNG, JPEG, GIF ou WebP.'));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }
});

const uploadPlaneImage = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, PLANES_UPLOADS),
    filename: (req, file, cb) => {
      const id = req.params.id || req.body?.id || Date.now();
      const ext = (file.originalname && path.extname(file.originalname)) || path.extname(file.mimetype) || '.png';
      cb(null, `plane-${id}-${Date.now()}${ext}`);
    }
  }),
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Type de fichier non autorisé. Utilisez PNG, JPEG, GIF ou WebP.'));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }
});

const uploadResourceImage = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, RESOURCES_UPLOADS),
    filename: (req, file, cb) => {
      const id = req.params.id || req.body?.id || Date.now();
      const ext = (file.originalname && path.extname(file.originalname)) || path.extname(file.mimetype) || '.png';
      cb(null, `resource-${id}-${Date.now()}${ext}`);
    }
  }),
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_IMAGE_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Type de fichier non autorisé. Utilisez PNG, JPEG, GIF ou WebP.'));
    }
  },
  limits: { fileSize: 5 * 1024 * 1024 }
});

app.use(cors({ origin: true, credentials: true }));
app.use(express.json());
app.use('/uploads', express.static(UPLOADS_DIR));

app.get('/api/health', (req, res) => {
  res.json({ message: 'Backend is running correctly', dbStatus: 'Attempting to check...' });
});

// --- Levels (gamification 1–15) ---
app.get('/api/levels', async (req, res) => {
  try {
    const levels = await Level.findAll({
      order: [['levelNumber', 'ASC']]
    });
    res.json(levels);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.get('/api/levels/:number', async (req, res) => {
  const number = parseInt(req.params.number, 10);
  if (Number.isNaN(number) || number < 1 || number > 15) {
    return res.status(400).json({ error: 'Numéro de niveau invalide (1–15)' });
  }
  try {
    const level = await Level.findOne({ where: { levelNumber: number } });
    if (!level) return res.status(404).json({ error: 'Niveau non trouvé' });
    res.json(level);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.put('/api/levels/:number', async (req, res) => {
  const number = parseInt(req.params.number, 10);
  if (Number.isNaN(number) || number < 1 || number > 15) {
    return res.status(400).json({ error: 'Numéro de niveau invalide (1–15)' });
  }
  const { name, description } = req.body || {};
  try {
    const [updated] = await Level.update(
      { name: name != null ? String(name) : undefined, description: description !== undefined ? (description == null ? null : String(description)) : undefined },
      { where: { levelNumber: number }, fields: ['name', 'description'] }
    );
    if (updated === 0) return res.status(404).json({ error: 'Niveau non trouvé' });
    const level = await Level.findOne({ where: { levelNumber: number } });
    res.json(level);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.post('/api/levels/:number/image', uploadLevelImage.single('image'), async (req, res) => {
  const number = parseInt(req.params.number, 10);
  if (Number.isNaN(number) || number < 1 || number > 15) {
    return res.status(400).json({ error: 'Numéro de niveau invalide (1–15)' });
  }
  if (!req.file) {
    return res.status(400).json({ error: 'Aucun fichier image envoyé' });
  }
  try {
    const imagePath = `levels/${req.file.filename}`;
    const [updated] = await Level.update(
      { image: imagePath },
      { where: { levelNumber: number } }
    );
    if (updated === 0) return res.status(404).json({ error: 'Niveau non trouvé' });
    const level = await Level.findOne({ where: { levelNumber: number } });
    res.json(level);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.use((err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'Fichier trop volumineux (max 5 Mo)' });
    }
  }
  if (err.message && err.message.includes('Type de fichier')) {
    return res.status(400).json({ error: err.message });
  }
  next(err);
});

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null;
  if (!token) {
    return res.status(401).json({ error: 'Non authentifié' });
  }
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.auth = decoded;
    next();
  } catch (e) {
    return res.status(401).json({ error: 'Token invalide ou expiré' });
  }
}

function requireAdmin(req, res, next) {
  if (req.auth?.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Accès réservé aux administrateurs' });
  }
  next();
}

// --- XP / Progression ---

async function checkLevelUp(user) {
  const currentLevel = user.levelId
    ? await Level.findByPk(user.levelId)
    : await Level.findOne({ where: { levelNumber: 1 } });

  if (!currentLevel) return user;

  const allLevels = await Level.findAll({ order: [['levelNumber', 'ASC']] });
  let newLevel = currentLevel;

  for (const lvl of allLevels) {
    if (lvl.levelNumber > currentLevel.levelNumber && user.xp >= lvl.xpRequired) {
      newLevel = lvl;
    }
  }

  if (newLevel.id !== currentLevel.id) {
    await user.update({ levelId: newLevel.id });
  }

  return user;
}

// Grant XP to a player (admin or system call)
app.post('/api/xp/grant', requireAuth, async (req, res) => {
  try {
    const { userId, amount, reason } = req.body || {};
    const callerRole = req.auth?.user?.role;
    const callerId = req.auth?.user?.id;

    // Players can only receive XP for themselves (for future self-triggered actions)
    const targetId = callerRole === 'admin' ? (userId || callerId) : callerId;
    const xpAmount = parseInt(amount, 10);

    if (!xpAmount || xpAmount <= 0) {
      return res.status(400).json({ error: 'Montant XP invalide' });
    }

    const user = await User.findByPk(targetId);
    if (!user || !user.isActive) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }

    const previousXp = user.xp;
    const previousLevelId = user.levelId;

    await user.update({ xp: user.xp + xpAmount });
    await checkLevelUp(user);
    await user.reload({
      attributes: { exclude: ['password'] },
      include: [{ model: Level, as: 'Level', attributes: ['id', 'levelNumber', 'name', 'image', 'xpRequired'] }]
    });

    const leveledUp = user.levelId !== previousLevelId;

    res.json({
      user,
      xpGained: xpAmount,
      previousXp,
      newXp: user.xp,
      leveledUp,
      reason: reason || null
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// Admin: set XP directly
app.patch('/api/users/:id/xp', requireAuth, requireAdmin, async (req, res) => {
  try {
    const { xp } = req.body || {};
    const newXp = parseInt(xp, 10);
    if (isNaN(newXp) || newXp < 0) {
      return res.status(400).json({ error: 'Valeur XP invalide' });
    }

    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });

    await user.update({ xp: newXp });
    await checkLevelUp(user);
    await user.reload({
      attributes: { exclude: ['password'] },
      include: [{ model: Level, as: 'Level', attributes: ['id', 'levelNumber', 'name', 'image', 'xpRequired'] }]
    });

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// --- Tanks (unités type tank) — admin only ---
app.get('/api/tanks', requireAuth, requireAdmin, async (req, res) => {
  try {
    const tanks = await Tank.findAll({ order: [['createdAt', 'DESC']] });
    res.json(tanks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.get('/api/tanks/:id', requireAuth, requireAdmin, async (req, res) => {
  const id = req.params.id?.trim();
  if (!id) return res.status(400).json({ error: 'ID manquant' });
  try {
    const tank = await Tank.findByPk(id);
    if (!tank) return res.status(404).json({ error: 'Unité non trouvée' });
    res.json(tank);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.post('/api/tanks', requireAuth, requireAdmin, uploadTankImage.single('image'), async (req, res) => {
  const name = req.body?.name?.trim();
  if (!name) return res.status(400).json({ error: 'Le nom est requis' });
  try {
    const imagePath = req.file ? `tanks/${req.file.filename}` : null;
    const tank = await Tank.create({
      name,
      description: req.body?.description?.trim() || null,
      image: imagePath
    });
    res.status(201).json(tank);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.patch('/api/tanks/:id', requireAuth, requireAdmin, async (req, res) => {
  const id = req.params.id?.trim();
  if (!id) return res.status(400).json({ error: 'ID manquant' });
  const { name, description } = req.body || {};
  try {
    const tank = await Tank.findByPk(id);
    if (!tank) return res.status(404).json({ error: 'Unité non trouvée' });
    const updates = {};
    if (name !== undefined) updates.name = String(name).trim() || tank.name;
    if (description !== undefined) updates.description = description == null ? null : String(description).trim();
    if (Object.keys(updates).length) await tank.update(updates);
    const updated = await Tank.findByPk(id);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.post('/api/tanks/:id/image', requireAuth, requireAdmin, uploadTankImage.single('image'), async (req, res) => {
  const id = req.params.id?.trim();
  if (!id) return res.status(400).json({ error: 'ID manquant' });
  if (!req.file) return res.status(400).json({ error: 'Aucun fichier image envoyé' });
  try {
    const tank = await Tank.findByPk(id);
    if (!tank) return res.status(404).json({ error: 'Unité non trouvée' });
    const imagePath = `tanks/${req.file.filename}`;
    await tank.update({ image: imagePath });
    const updated = await Tank.findByPk(id);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.delete('/api/tanks/:id', requireAuth, requireAdmin, async (req, res) => {
  const id = req.params.id?.trim();
  if (!id) return res.status(400).json({ error: 'ID manquant' });
  try {
    const tank = await Tank.findByPk(id);
    if (!tank) return res.status(404).json({ error: 'Unité non trouvée' });
    await tank.destroy();
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// --- Planes (unités type avion) — admin only ---
app.get('/api/planes', requireAuth, requireAdmin, async (req, res) => {
  try {
    const planes = await Plane.findAll({ order: [['createdAt', 'DESC']] });
    res.json(planes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.get('/api/planes/:id', requireAuth, requireAdmin, async (req, res) => {
  const id = req.params.id?.trim();
  if (!id) return res.status(400).json({ error: 'ID manquant' });
  try {
    const plane = await Plane.findByPk(id);
    if (!plane) return res.status(404).json({ error: 'Unité non trouvée' });
    res.json(plane);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.post('/api/planes', requireAuth, requireAdmin, uploadPlaneImage.single('image'), async (req, res) => {
  const name = req.body?.name?.trim();
  if (!name) return res.status(400).json({ error: 'Le nom est requis' });
  try {
    const imagePath = req.file ? `planes/${req.file.filename}` : null;
    const plane = await Plane.create({
      name,
      description: req.body?.description?.trim() || null,
      image: imagePath
    });
    res.status(201).json(plane);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.patch('/api/planes/:id', requireAuth, requireAdmin, async (req, res) => {
  const id = req.params.id?.trim();
  if (!id) return res.status(400).json({ error: 'ID manquant' });
  const { name, description } = req.body || {};
  try {
    const plane = await Plane.findByPk(id);
    if (!plane) return res.status(404).json({ error: 'Unité non trouvée' });
    const updates = {};
    if (name !== undefined) updates.name = String(name).trim() || plane.name;
    if (description !== undefined) updates.description = description == null ? null : String(description).trim();
    if (Object.keys(updates).length) await plane.update(updates);
    const updated = await Plane.findByPk(id);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.post('/api/planes/:id/image', requireAuth, requireAdmin, uploadPlaneImage.single('image'), async (req, res) => {
  const id = req.params.id?.trim();
  if (!id) return res.status(400).json({ error: 'ID manquant' });
  if (!req.file) return res.status(400).json({ error: 'Aucun fichier image envoyé' });
  try {
    const plane = await Plane.findByPk(id);
    if (!plane) return res.status(404).json({ error: 'Unité non trouvée' });
    const imagePath = `planes/${req.file.filename}`;
    await plane.update({ image: imagePath });
    const updated = await Plane.findByPk(id);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.delete('/api/planes/:id', requireAuth, requireAdmin, async (req, res) => {
  const id = req.params.id?.trim();
  if (!id) return res.status(400).json({ error: 'ID manquant' });
  try {
    const plane = await Plane.findByPk(id);
    if (!plane) return res.status(404).json({ error: 'Unité non trouvée' });
    await plane.destroy();
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

// --- Ressources de base — admin only ---
app.get('/api/resources', requireAuth, requireAdmin, async (req, res) => {
  try {
    const resources = await Resource.findAll({ order: [['createdAt', 'DESC']] });
    res.json(resources);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.get('/api/resources/:id', requireAuth, requireAdmin, async (req, res) => {
  const id = req.params.id?.trim();
  if (!id) return res.status(400).json({ error: 'ID manquant' });
  try {
    const resource = await Resource.findByPk(id);
    if (!resource) return res.status(404).json({ error: 'Ressource non trouvée' });
    res.json(resource);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.post('/api/resources', requireAuth, requireAdmin, uploadResourceImage.single('image'), async (req, res) => {
  const name = req.body?.name?.trim();
  if (!name) return res.status(400).json({ error: 'Le nom est requis' });
  try {
    const imagePath = req.file ? `resources/${req.file.filename}` : null;
    const resource = await Resource.create({
      name,
      description: req.body?.description?.trim() || null,
      image: imagePath
    });
    res.status(201).json(resource);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.patch('/api/resources/:id', requireAuth, requireAdmin, async (req, res) => {
  const id = req.params.id?.trim();
  if (!id) return res.status(400).json({ error: 'ID manquant' });
  const { name, description } = req.body || {};
  try {
    const resource = await Resource.findByPk(id);
    if (!resource) return res.status(404).json({ error: 'Ressource non trouvée' });
    const updates = {};
    if (name !== undefined) updates.name = String(name).trim() || resource.name;
    if (description !== undefined) updates.description = description == null ? null : String(description).trim();
    if (Object.keys(updates).length) await resource.update(updates);
    const updated = await Resource.findByPk(id);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.post('/api/resources/:id/image', requireAuth, requireAdmin, uploadResourceImage.single('image'), async (req, res) => {
  const id = req.params.id?.trim();
  if (!id) return res.status(400).json({ error: 'ID manquant' });
  if (!req.file) return res.status(400).json({ error: 'Aucun fichier image envoyé' });
  try {
    const resource = await Resource.findByPk(id);
    if (!resource) return res.status(404).json({ error: 'Ressource non trouvée' });
    const imagePath = `resources/${req.file.filename}`;
    await resource.update({ image: imagePath });
    const updated = await Resource.findByPk(id);
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.delete('/api/resources/:id', requireAuth, requireAdmin, async (req, res) => {
  const id = req.params.id?.trim();
  if (!id) return res.status(400).json({ error: 'ID manquant' });
  try {
    const resource = await Resource.findByPk(id);
    if (!resource) return res.status(404).json({ error: 'Ressource non trouvée' });
    await resource.destroy();
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.get('/api/auth/me', requireAuth, async (req, res) => {
  try {
    const userId = req.auth?.user?.id;
    if (!userId) return res.status(401).json({ error: 'Non authentifié' });
    const user = await User.findOne({
      where: { id: userId, isActive: true },
      attributes: { exclude: ['password'] },
      include: [{ model: Level, as: 'Level', attributes: ['id', 'levelNumber', 'name', 'image', 'xpRequired'] }]
    });
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.patch('/api/auth/me', requireAuth, async (req, res) => {
  try {
    const userId = req.auth?.user?.id;
    if (!userId) return res.status(401).json({ error: 'Non authentifié' });
    const user = await User.findByPk(userId);
    if (!user || !user.isActive) return res.status(404).json({ error: 'Utilisateur non trouvé' });

    const { email: bodyEmail, currentPassword, newPassword } = req.body || {};
    const updates = {};

    if (bodyEmail != null && bodyEmail !== '') {
      const email = String(bodyEmail).trim().toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ error: 'Adresse email invalide' });
      }
      const existing = await User.findOne({ where: { email } });
      if (existing && existing.id !== userId) {
        return res.status(409).json({ error: 'Un compte existe déjà avec cet email' });
      }
      updates.email = email;
    }

    if (newPassword != null && newPassword !== '') {
      if (!currentPassword || typeof currentPassword !== 'string') {
        return res.status(400).json({ error: 'Mot de passe actuel requis pour en changer un' });
      }
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Mot de passe actuel incorrect' });
      }
      if (newPassword.length < 6) {
        return res.status(400).json({ error: 'Le nouveau mot de passe doit faire au moins 6 caractères' });
      }
      updates.password = await bcrypt.hash(newPassword, 10);
    }

    if (Object.keys(updates).length === 0) {
      const current = await User.findByPk(userId, {
        attributes: { exclude: ['password'] },
        include: [{ model: Level, as: 'Level', attributes: ['id', 'levelNumber', 'name', 'image', 'xpRequired'] }]
      });
      return res.json(current);
    }

    await user.update(updates);
    const updated = await User.findByPk(userId, {
      attributes: { exclude: ['password'] },
      include: [{ model: Level, as: 'Level', attributes: ['id', 'levelNumber', 'name', 'image', 'xpRequired'] }]
    });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.get('/api/users', async (req, res) => {
  console.log('GET /api/users', req.query);
  try {
    const { role, isActive, search } = req.query;
    const where = {};

    if (role === 'admin' || role === 'player') {
      where.role = role;
    }
    if (isActive === 'true' || isActive === 'false') {
      where.isActive = isActive === 'true';
    }
    if (search && typeof search === 'string' && search.trim()) {
      const term = `%${search.trim()}%`;
      where[Op.or] = [
        { email: { [Op.iLike]: term } },
        { username: { [Op.iLike]: term } }
      ];
    }

    const users = await User.findAll({
      where,
      include: [{ model: Level, as: 'Level', attributes: ['id', 'levelNumber', 'name', 'image', 'xpRequired'] }],
      order: [['createdAt', 'DESC']],
      attributes: { exclude: ['password'] }
    });

    res.json(users);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.post(['/api/users', '/api/users/'], async (req, res) => {
  console.log('POST /api/users', req.body?.email);
  const { username: bodyUsername, email, password, role: bodyRole, levelId: bodyLevelId } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email et mot de passe requis' });
  }

  const role = bodyRole === 'admin' || bodyRole === 'player' ? bodyRole : 'player';
  let levelId = null;
  if (role === 'player') {
    if (bodyLevelId != null) {
      const l = await Level.findByPk(parseInt(bodyLevelId, 10));
      if (l) levelId = l.id;
    }
    if (levelId == null) {
      const defaultLevel = await Level.findOne({ where: { levelNumber: 1 } });
      levelId = defaultLevel?.id ?? null;
    }
  }

  try {
    const derivedUsername = (bodyUsername || email.replace(/@.*$/, '').replace(/[^a-z0-9]/gi, '_').toLowerCase()) || 'user';
    const existing = await User.findOne({
      where: { [Op.or]: [{ email }, { username: derivedUsername }] }
    });
    if (existing) {
      if (existing.email === email) {
        return res.status(409).json({ error: 'Un compte existe déjà avec cet email' });
      }
      return res.status(409).json({ error: 'Ce nom d\'utilisateur est déjà pris' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await User.create({
      username: derivedUsername,
      email,
      password: hashedPassword,
      role,
      levelId
    });

    const created = await User.findByPk(user.id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Level, as: 'Level', attributes: ['id', 'levelNumber', 'name', 'image', 'xpRequired'] }]
    });
    res.status(201).json(created ? created.get({ plain: true }) : {});
  } catch (err) {
    console.error(err);
    if (err.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ error: 'Email ou nom d\'utilisateur déjà utilisé' });
    }
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.get('/api/users/:id', async (req, res) => {
  const id = req.params.id?.trim();
  if (!id) {
    return res.status(400).json({ error: 'ID manquant' });
  }
  try {
    const user = await User.findOne({
      where: { id },
      attributes: { exclude: ['password'] },
      include: [{ model: Level, as: 'Level', attributes: ['id', 'levelNumber', 'name', 'image', 'xpRequired'] }]
    });
    if (!user) {
      return res.status(404).json({ error: 'Utilisateur non trouvé' });
    }
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.patch('/api/users/:id', requireAuth, requireAdmin, async (req, res) => {
  const id = req.params.id?.trim();
  if (!id) return res.status(400).json({ error: 'ID manquant' });
  const { username: bodyUsername, email: bodyEmail, newPassword, isActive, levelId: bodyLevelId } = req.body || {};
  try {
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });
    const updates = {};

    if (bodyUsername != null && bodyUsername !== '') {
      const username = String(bodyUsername).trim();
      if (username.length < 2) {
        return res.status(400).json({ error: 'Le pseudo doit faire au moins 2 caractères' });
      }
      const existingUsername = await User.findOne({ where: { username } });
      if (existingUsername && existingUsername.id !== id) {
        return res.status(409).json({ error: 'Ce pseudo est déjà pris' });
      }
      updates.username = username;
    }

    if (bodyEmail != null && bodyEmail !== '') {
      const email = String(bodyEmail).trim().toLowerCase();
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ error: 'Adresse email invalide' });
      }
      const existingEmail = await User.findOne({ where: { email } });
      if (existingEmail && existingEmail.id !== id) {
        return res.status(409).json({ error: 'Un compte existe déjà avec cet email' });
      }
      updates.email = email;
    }

    if (typeof isActive === 'boolean') updates.isActive = isActive;

    if (newPassword != null && newPassword !== '') {
      if (newPassword.length < 6) {
        return res.status(400).json({ error: 'Le mot de passe doit faire au moins 6 caractères' });
      }
      updates.password = await bcrypt.hash(newPassword, 10);
    }

    if (user.role === 'player' && bodyLevelId != null) {
      const l = await Level.findByPk(parseInt(bodyLevelId, 10));
      if (l) updates.levelId = l.id;
    }

    if (Object.keys(updates).length) await user.update(updates);
    const updated = await User.findByPk(id, {
      attributes: { exclude: ['password'] },
      include: [{ model: Level, as: 'Level', attributes: ['id', 'levelNumber', 'name', 'image', 'xpRequired'] }]
    });
    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

app.delete('/api/users/:id', async (req, res) => {
  const id = req.params.id?.trim();
  if (!id) return res.status(400).json({ error: 'ID manquant' });
  try {
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ error: 'Utilisateur non trouvé' });
    await user.destroy();
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID || '';
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET || '';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';

function getBackendOrigin(req) {
  if (process.env.BACKEND_URL) return process.env.BACKEND_URL.replace(/\/$/, '');
  const host = req.headers['x-forwarded-host'] || req.get('host');
  const proto = req.headers['x-forwarded-proto'] || req.protocol || 'http';
  if (host && host.includes(':')) {
    const port = host.split(':')[1];
    if (port === '5173' || port === '3000') {
      return `http://localhost:${PORT}`;
    }
  }
  return host ? `${proto}://${host}` : `http://localhost:${PORT}`;
}

app.get('/api/auth/google', (req, res) => {
  if (!GOOGLE_CLIENT_ID) {
    const from = typeof req.query.from === 'string' ? req.query.from : FRONTEND_URL;
    return res.redirect(`${from}/auth/callback?error=google_not_configured`);
  }
  const from = typeof req.query.from === 'string' ? req.query.from : FRONTEND_URL;
  const backendOrigin = getBackendOrigin(req);
  const redirectUri = `${backendOrigin}/api/auth/google/callback`;
  const state = encodeURIComponent(from);
  const scope = encodeURIComponent('openid email profile');
  const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(GOOGLE_CLIENT_ID)}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scope}&access_type=offline&prompt=consent&state=${state}`;
  res.redirect(url);
});

app.get('/api/auth/google/callback', async (req, res) => {
  if (!GOOGLE_CLIENT_ID || !GOOGLE_CLIENT_SECRET) {
    return res.redirect(`${FRONTEND_URL}/auth/login2?error=google_not_configured`);
  }
  const { code, state, error: oauthError } = req.query;
  const frontendOrigin = (typeof state === 'string' ? decodeURIComponent(state) : null) || FRONTEND_URL;
  const callbackUrl = `${frontendOrigin}/auth/callback`;

  if (oauthError) {
    return res.redirect(`${callbackUrl}?error=${encodeURIComponent(String(oauthError))}`);
  }
  if (!code || typeof code !== 'string') {
    return res.redirect(`${callbackUrl}?error=missing_code`);
  }

  try {
    const backendOrigin = getBackendOrigin(req);
    const redirectUri = `${backendOrigin}/api/auth/google/callback`;

    const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({
        code,
        client_id: GOOGLE_CLIENT_ID,
        client_secret: GOOGLE_CLIENT_SECRET,
        redirect_uri: redirectUri,
        grant_type: 'authorization_code'
      })
    });
    if (!tokenRes.ok) {
      const errBody = await tokenRes.text();
      console.error('Google token error', tokenRes.status, errBody);
      return res.redirect(`${callbackUrl}?error=token_exchange_failed`);
    }
    const tokens = await tokenRes.json();
    const accessToken = tokens.access_token;
    if (!accessToken) {
      return res.redirect(`${callbackUrl}?error=no_access_token`);
    }

    const userRes = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });
    if (!userRes.ok) {
      console.error('Google userinfo error', userRes.status);
      return res.redirect(`${callbackUrl}?error=userinfo_failed`);
    }
    const profile = await userRes.json();
    const email = profile.email;
    if (!email) {
      return res.redirect(`${callbackUrl}?error=email_not_granted`);
    }

    let user = await User.findOne({ where: { email } });
    if (!user) {
      const derivedUsername = email.replace(/@.*$/, '').replace(/[^a-z0-9]/gi, '_').toLowerCase() || 'user';
      let username = derivedUsername;
      let n = 0;
      while (await User.findOne({ where: { username } })) {
        n += 1;
        username = `${derivedUsername}_${n}`;
      }
      const defaultLevel = await Level.findOne({ where: { levelNumber: 1 } });
      user = await User.create({
        username,
        email,
        password: await bcrypt.hash(Math.random().toString(36) + Date.now(), 10),
        role: 'player',
        levelId: defaultLevel?.id ?? null
      });
    }

    if (!user.isActive) {
      return res.redirect(`${callbackUrl}?error=account_disabled`);
    }

    const token = jwt.sign(
      { user: { id: user.id, email: user.email, username: user.username, role: user.role } },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '24h' }
    );
    res.redirect(`${callbackUrl}?token=${encodeURIComponent(token)}`);
  } catch (err) {
    console.error('Google callback error', err);
    res.redirect(`${callbackUrl}?error=server_error`);
  }
});

app.post('/api/auth/signin/local', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(401).send('Utilisateur non trouvé');
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).send('Mot de passe incorrect');
    }

    const token = jwt.sign(
      { user: { id: user.id, email: user.email, username: user.username, role: user.role } },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '24h' }
    );

    res.json(token);
  } catch (error) {
    console.error(error);
    res.status(500).send('Erreur serveur');
  }
});

app.post('/api/auth/register', async (req, res) => {
  const { username: bodyUsername, email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email et mot de passe requis' });
  }

  try {
    const derivedUsername = (bodyUsername || email.replace(/@.*$/, '').replace(/[^a-z0-9]/gi, '_').toLowerCase()) || 'user';
    const existing = await User.findOne({
      where: { [Op.or]: [{ email }, { username: derivedUsername }] }
    });
    if (existing) {
      if (existing.email === email) {
        return res.status(409).json({ error: 'Un compte existe déjà avec cet email' });
      }
      return res.status(409).json({ error: 'Ce nom d\'utilisateur est déjà pris' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    const defaultLevel = await Level.findOne({ where: { levelNumber: 1 } });

    const user = await User.create({
      username: derivedUsername,
      email,
      password: hashedPassword,
      role: 'player',
      levelId: defaultLevel?.id ?? null
    });

    const token = jwt.sign(
      { user: { id: user.id, email: user.email, username: user.username, role: user.role } },
      process.env.JWT_SECRET || 'secret',
      { expiresIn: '24h' }
    );

    res.status(201).json(token);
  } catch (error) {
    console.error(error);
    if (error.name === 'SequelizeUniqueConstraintError') {
      return res.status(409).json({ error: 'Email ou nom d\'utilisateur déjà utilisé' });
    }
    res.status(500).json({ error: 'Erreur serveur' });
  }
});

const startServer = async () => {
  try {
    await sequelize.authenticate();
    console.log('PostgreSQL connected...');

    await sequelize.sync({ force: false });
    console.log('Database synchronized');

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
  }
};

startServer();
