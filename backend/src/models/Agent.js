export default class Agent {
  constructor(name, context, objective, communication, sector, companyName) {
    this.name = name;
    this.context = context;
    this.objective = objective;
    this.communication = communication;
    this.sector = sector;
    this.companyName = companyName;
  }

  getGlobalContext() {
    return `
    
    `;
  }
}
