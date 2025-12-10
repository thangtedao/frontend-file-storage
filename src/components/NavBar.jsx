import classNames from "classnames";
import SearchInput from "./SearchInput";
import UserAvatar from "./UserAvatar";

const NavBar = ({ className }) => {
  const classes = classNames(
    className,
    "flex justify-between mb-6 px-8 py-4 bg-white"
  );

  return (
    <div className={classes}>
      <SearchInput />
      <div>
        <UserAvatar />
      </div>
    </div>
  );
};

export default NavBar;
