/**
 * Mock In-Memory Database for Development
 * Stores user data in memory - resets on server restart
 */

const users = [];
const grievances = [];
const categories = [];
const comments = [];
const statusHistory = [];
const documents = [];

let userIdCounter = 1;
let grievanceIdCounter = 1;
let categoryIdCounter = 1;
let commentIdCounter = 1;
let statusHistoryIdCounter = 1;
let documentIdCounter = 1;

// Default categories
const defaultCategories = [
  { id: 1, name: 'Education', description: 'Education related grievances' },
  { id: 2, name: 'Health', description: 'Health related grievances' },
  { id: 3, name: 'Infrastructure', description: 'Infrastructure related grievances' },
  { id: 4, name: 'Service', description: 'Service related grievances' },
  { id: 5, name: 'Complaint', description: 'General complaints' }
];

// Initialize with default categories
defaultCategories.forEach(cat => {
  categories.push({ ...cat, created_at: new Date() });
  categoryIdCounter = Math.max(categoryIdCounter, cat.id) + 1;
});

const mockDB = {
  // ===== USERS =====
  addUser: async (name, email, hashedPassword, role) => {
    const existingUser = users.find(u => u.email === email);
    if (existingUser) {
      throw new Error('Email already registered');
    }

    const newUser = {
      id: userIdCounter++,
      name,
      email,
      password: hashedPassword,
      role,
      createdAt: new Date()
    };

    users.push(newUser);
    return newUser;
  },

  findUserByEmail: async (email) => {
    return users.find(u => u.email === email) || null;
  },

  findUserById: async (id) => {
    return users.find(u => u.id === id) || null;
  },

  getAllUsers: async () => {
    return users;
  },

  deleteUser: async (id) => {
    const index = users.findIndex(u => u.id === id);
    if (index > -1) {
      users.splice(index, 1);
      return true;
    }
    return false;
  },

  // ===== GRIEVANCES =====
  createGrievance: async (userId, title, description, categoryId, priority) => {
    const grievance = {
      id: grievanceIdCounter++,
      user_id: userId,
      title,
      description,
      category_id: categoryId,
      priority,
      status: 'open',
      assigned_to: null,
      created_at: new Date(),
      updated_at: new Date()
    };
    grievances.push(grievance);
    return grievance;
  },

  getGrievanceById: async (id) => {
    const grievance = grievances.find(g => g.id === id);
    if (!grievance) return null;
    const user = users.find(u => u.id === grievance.user_id);
    const category = categories.find(c => c.id === grievance.category_id);
    return {
      ...grievance,
      user_name: user?.name,
      user_email: user?.email,
      category_name: category?.name
    };
  },

  getUserGrievances: async (userId, page = 1, limit = 10) => {
    const userGrievances = grievances.filter(g => g.user_id === userId);
    const total = userGrievances.length;
    const offset = (page - 1) * limit;
    const data = userGrievances
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(offset, offset + limit)
      .map(g => {
        const user = users.find(u => u.id === g.user_id);
        const category = categories.find(c => c.id === g.category_id);
        return {
          ...g,
          user_name: user?.name,
          user_email: user?.email,
          category_name: category?.name
        };
      });
    return { data, total, page, limit };
  },

  getAllGrievances: async (filters = {}, page = 1, limit = 10) => {
    let filtered = grievances;
    if (filters.status) {
      filtered = filtered.filter(g => g.status === filters.status);
    }
    if (filters.category_id) {
      filtered = filtered.filter(g => g.category_id === filters.category_id);
    }
    if (filters.priority) {
      filtered = filtered.filter(g => g.priority === filters.priority);
    }
    const total = filtered.length;
    const offset = (page - 1) * limit;
    const data = filtered
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      .slice(offset, offset + limit)
      .map(g => {
        const user = users.find(u => u.id === g.user_id);
        const category = categories.find(c => c.id === g.category_id);
        return {
          ...g,
          user_name: user?.name,
          user_email: user?.email,
          category_name: category?.name
        };
      });
    return { data, total, page, limit };
  },

  updateGrievanceStatus: async (grievanceId, newStatus, changedBy, reason) => {
    const grievance = grievances.find(g => g.id === grievanceId);
    if (!grievance) throw new Error('Grievance not found');
    
    const oldStatus = grievance.status;
    grievance.status = newStatus;
    grievance.updated_at = new Date();

    // Record status change
    if (changedBy) {
      const history = {
        id: statusHistoryIdCounter++,
        grievance_id: grievanceId,
        old_status: oldStatus,
        new_status: newStatus,
        changed_by: changedBy,
        reason: reason || '',
        created_at: new Date()
      };
      statusHistory.push(history);
    }

    return grievance;
  },

  assignGrievance: async (grievanceId, staffId) => {
    const grievance = grievances.find(g => g.id === grievanceId);
    if (!grievance) throw new Error('Grievance not found');
    grievance.assigned_to = staffId;
    grievance.updated_at = new Date();
    return grievance;
  },

  // ===== CATEGORIES =====
  getAllCategories: async () => {
    return categories;
  },

  getCategoryById: async (id) => {
    return categories.find(c => c.id === id);
  },

  // ===== COMMENTS =====
  addComment: async (grievanceId, userId, text) => {
    const comment = {
      id: commentIdCounter++,
      grievance_id: grievanceId,
      user_id: userId,
      text,
      created_at: new Date()
    };
    comments.push(comment);
    return comment;
  },

  getGrievanceComments: async (grievanceId) => {
    return comments
      .filter(c => c.grievance_id === grievanceId)
      .map(c => {
        const user = users.find(u => u.id === c.user_id);
        return {
          ...c,
          user_name: user?.name,
          user_email: user?.email
        };
      });
  },

  // ===== STATUS HISTORY =====
  getGrievanceStatusHistory: async (grievanceId) => {
    return statusHistory.filter(sh => sh.grievance_id === grievanceId);
  },

  // ===== DOCUMENTS =====
  uploadDocument: async (grievanceId, userId, filename, originalName) => {
    const document = {
      id: documentIdCounter++,
      grievance_id: grievanceId,
      user_id: userId,
      filename,
      original_name: originalName,
      created_at: new Date()
    };
    documents.push(document);
    return document;
  },

  getGrievanceDocuments: async (grievanceId) => {
    return documents.filter(d => d.grievance_id === grievanceId);
  },

  // ===== UTILITY =====
  clear: () => {
    users.length = 0;
    grievances.length = 0;
    comments.length = 0;
    statusHistory.length = 0;
    documents.length = 0;
    userIdCounter = 1;
    grievanceIdCounter = 1;
    categoryIdCounter = defaultCategories.length + 1;
    commentIdCounter = 1;
    statusHistoryIdCounter = 1;
    documentIdCounter = 1;
    
    // Reinitialize default categories
    categories.length = 0;
    defaultCategories.forEach(cat => {
      categories.push({ ...cat, created_at: new Date() });
    });
  }
};

module.exports = mockDB;
