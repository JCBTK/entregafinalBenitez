class UserDTO {
    constructor({ _id, name, email, role }) {
        this.id = _id;
        this.name = name;
        this.email = email;
        this.role = role;
    }
}

export default UserDTO;
