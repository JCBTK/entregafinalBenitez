import Ticket from "../models/ticketModel.js";
import { v4 as uuidv4 } from "uuid";

class TicketService {
    async createTicket(amount, purchaser) {
        try {
            const ticket = new Ticket({
                code: uuidv4(),
                amount,
                purchaser
            });
            await ticket.save();
            return ticket;
        } catch (error) {
            console.error('Error al crear el ticket:', error);
            throw error;
        }
    }
}

export default new TicketService();