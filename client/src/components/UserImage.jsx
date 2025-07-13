import { Box } from "@mui/material";
import allowOrigins from "../allowOrigins";

const UserImage = ({ image, size = "60px" }) => {
    const handleImageError = (e) => {
        e.target.src = `${allowOrigins}/assets/default-avatar.png`; // FIXED: removed .local
    };

    const imageSrc = image ? `${allowOrigins}/assets/${image}` : `${allowOrigins}/assets/default-avatar.png`;

    return (
        <Box width={size} height={size}>
            <img
                style={{ objectFit: "cover", borderRadius: "50%" }}
                width={size}
                height={size}
                alt="user"
                src={imageSrc}
                onError={handleImageError}
            />
        </Box>
    );
};

export default UserImage;