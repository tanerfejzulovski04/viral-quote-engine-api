// Simple in-memory quote storage (in production, this would be a database)
class Quote {
  constructor(text, author, category = 'general', createdBy = null) {
    this.id = Quote.generateId();
    this.text = text;
    this.author = author;
    this.category = category;
    this.createdBy = createdBy;
    this.createdAt = new Date().toISOString();
    this.likes = 0;
    this.shares = 0;
  }

  static generateId() {
    return Date.now() + Math.random().toString(36).substr(2, 9);
  }

  static quotes = [
    new Quote("The only way to do great work is to love what you do.", "Steve Jobs", "motivation"),
    new Quote("Life is what happens to you while you're busy making other plans.", "John Lennon", "life"),
    new Quote("The future belongs to those who believe in the beauty of their dreams.", "Eleanor Roosevelt", "inspiration"),
    new Quote("It is during our darkest moments that we must focus to see the light.", "Aristotle", "motivation"),
    new Quote("The only impossible journey is the one you never begin.", "Tony Robbins", "motivation")
  ];

  static findAll(filters = {}) {
    let result = [...Quote.quotes];
    
    if (filters.category) {
      result = result.filter(q => q.category === filters.category);
    }
    
    if (filters.author) {
      result = result.filter(q => q.author.toLowerCase().includes(filters.author.toLowerCase()));
    }
    
    if (filters.search) {
      result = result.filter(q => 
        q.text.toLowerCase().includes(filters.search.toLowerCase()) ||
        q.author.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    return result;
  }

  static findById(id) {
    return Quote.quotes.find(q => q.id === id);
  }

  static create(data) {
    const quote = new Quote(data.text, data.author, data.category, data.createdBy);
    Quote.quotes.push(quote);
    return quote;
  }

  static update(id, data) {
    const quote = Quote.findById(id);
    if (!quote) return null;
    
    Object.keys(data).forEach(key => {
      if (key !== 'id' && key !== 'createdAt') {
        quote[key] = data[key];
      }
    });
    
    return quote;
  }

  static delete(id) {
    const index = Quote.quotes.findIndex(q => q.id === id);
    if (index === -1) return false;
    
    Quote.quotes.splice(index, 1);
    return true;
  }

  static getRandomQuote() {
    const randomIndex = Math.floor(Math.random() * Quote.quotes.length);
    return Quote.quotes[randomIndex];
  }

  static getCategories() {
    const categories = [...new Set(Quote.quotes.map(q => q.category))];
    return categories;
  }
}

module.exports = Quote;