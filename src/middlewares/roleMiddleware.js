export const roleMiddleware = (requiredRole) => {
    return (req, res, next) => {
        try {
            if (!req.user || req.user.role !== requiredRole) {
                console.warn(`Acceso denegado: usuario con rol ${req.user?.role} intentó acceder.`);
                return res.status(403).json({ message: 'Acceso denegado. Rol insuficiente.' });
            }
            next();
        } catch (error) {
            console.error('Error en roleMiddleware:', error);
            res.status(500).json({ message: 'Error en la validación del rol' });
        }
    };
};
