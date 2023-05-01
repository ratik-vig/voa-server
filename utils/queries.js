const queries = {
    checkIfUserExists: "select count(*) as count from voa.rdh_user where user_email=?",
    createUser: "insert into voa.rdh_user(user_email, user_password, is_admin) values(?,?,?)",
    loginUser: "select * from voa.rdh_user where user_email=?",
    createConversation: "insert into flashchat.fc_conversations(fc_conv_user1, fc_conv_user2, fc_conv_date_created) values(?,?,?)",
    getAttractionNames: "select atrn_id, atrn_name from voa.rdh_attraction order by atrn_name limit 10",
    getShowNames: "select show_id, show_name from voa.rdh_show order by show_name limit 10",
    getAttractionById: "select * from voa.rdh_attraction where atrn_id=?",
    createVisitor: "insert into voa.rdh_visitor (visitor_fname, visitor_lname, visitor_dob, visitor_email, visitor_phone, visitor_member, visitor_staddr, visitor_city, visitor_state, visitor_zipcode) values (?,?,?,?,?,?,?,?,?,?)",
    createTicketOrder: "insert into voa.rdh_ticket_order (t_order_date, t_order_amt) values (?, ?)",
    getVisitorLock: "SELECT GET_LOCK('vis_lock', 1000)",
    relaseVisitorLock: "DO RELEASE_LOCK('vis_lock')",
    findLastAddedVisitor: "select visitor_id from rdh_visitor order by visitor_id desc limit 1",
    findLastTicketOrder: "select t_order_id from rdh_ticket_order order by t_order_id desc limit 1",
    createTicket: "insert into voa.rdh_ticket(ticket_method, ticket_type, visitor_type, visitor_id, t_order_id) values (?,?,?,?,?)",
    createVisit: "insert into voa.rdh_visit(visit_date, visitor_id) values (?,?)"
}

module.exports = queries