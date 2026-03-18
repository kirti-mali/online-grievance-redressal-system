const pool = require('../config/database');

exports.getAllCategories = async (req, res) => {
  try {
    const conn = await pool.getConnection();
    try {
      const [categories] = await conn.query('SELECT * FROM categories ORDER BY name ASC');
      res.json({ success: true, data: categories });
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch categories' });
  }
};

exports.getCategoryById = async (req, res) => {
  try {
    const conn = await pool.getConnection();
    try {
      const [categories] = await conn.query('SELECT * FROM categories WHERE id = ?', [req.params.id]);
      if (categories.length === 0) return res.status(404).json({ success: false, message: 'Category not found' });
      res.json({ success: true, data: categories[0] });
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch category' });
  }
};

exports.createCategory = async (req, res) => {
  try {
    const { name, description } = req.body;
    const conn = await pool.getConnection();
    try {
      const [existing] = await conn.query('SELECT id FROM categories WHERE name = ?', [name]);
      if (existing.length > 0) return res.status(400).json({ success: false, message: 'Category already exists' });

      const [result] = await conn.query('INSERT INTO categories (name, description) VALUES (?, ?)', [name, description]);
      res.status(201).json({ success: true, message: 'Category created successfully', category: { id: result.insertId, name, description } });
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ success: false, message: 'Failed to create category' });
  }
};

exports.updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const conn = await pool.getConnection();
    try {
      const [categories] = await conn.query('SELECT id FROM categories WHERE id = ?', [id]);
      if (categories.length === 0) return res.status(404).json({ success: false, message: 'Category not found' });

      if (name) {
        const [existing] = await conn.query('SELECT id FROM categories WHERE name = ? AND id != ?', [name, id]);
        if (existing.length > 0) return res.status(400).json({ success: false, message: 'Category name already exists' });
      }

      const fields = [], values = [];
      if (name) { fields.push('name = ?'); values.push(name); }
      if (description) { fields.push('description = ?'); values.push(description); }
      if (!fields.length) return res.status(400).json({ success: false, message: 'No fields to update' });

      values.push(id);
      await conn.query(`UPDATE categories SET ${fields.join(', ')} WHERE id = ?`, values);
      res.json({ success: true, message: 'Category updated successfully' });
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ success: false, message: 'Failed to update category' });
  }
};

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const conn = await pool.getConnection();
    try {
      const [categories] = await conn.query('SELECT id FROM categories WHERE id = ?', [id]);
      if (categories.length === 0) return res.status(404).json({ success: false, message: 'Category not found' });

      const [grievances] = await conn.query('SELECT COUNT(*) as count FROM grievances WHERE category_id = ?', [id]);
      if (grievances[0].count > 0) return res.status(400).json({ success: false, message: 'Cannot delete category that has grievances' });

      await conn.query('DELETE FROM categories WHERE id = ?', [id]);
      res.json({ success: true, message: 'Category deleted successfully' });
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ success: false, message: 'Failed to delete category' });
  }
};

exports.getCategoriesWithCount = async (req, res) => {
  try {
    const conn = await pool.getConnection();
    try {
      const [categories] = await conn.query(`
        SELECT c.*, COUNT(g.id) as grievance_count
        FROM categories c
        LEFT JOIN grievances g ON c.id = g.category_id
        GROUP BY c.id ORDER BY c.name ASC
      `);
      res.json({ success: true, data: categories });
    } finally {
      conn.release();
    }
  } catch (error) {
    console.error('Get categories with count error:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch categories' });
  }
};
