import React, { useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { googleLogout, useGoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import axios from "axios";
import { FcGoogle } from "react-icons/fc";

const Header = () => {
  const [openDialog, setOpenDialog] = useState(false);
  const [profilePic, setProfilePic] = useState(null);

  const user = JSON.parse(localStorage.getItem("user"));
  useEffect(() => {
    setProfilePic(user?.picture);
  }, [user]);
  const login = useGoogleLogin({
    onSuccess: (codeResp) => GetUserProfile(codeResp),
    onError: (error) => console.log(error),
  });

  const GetUserProfile = (tokenInfo) => {
    axios
      .get(
        `https://www.googleapis.com/oauth2/v1/userinfo?access_token=${tokenInfo?.access_token}`,
        {
          headers: {
            Authorization: `Bearer ${tokenInfo?.access_token}`,
            Accept: "Application/json",
          },
        }
      )
      .then((res) => {
        console.log(res.data);
        localStorage.setItem("user", JSON.stringify(res.data));
        setOpenDialog(false);
        window.location.reload();
      });
  };

  return (
    <div className=" p-3 shadow-sm flex items-center justify-between px-5">
      <img src="/logo.svg" alt="logo" />
      <div>
        {user ? (
          <div className=" flex items-center gap-5">
            <a href="/create-trip">
              <Button variant="outline" className=" rounded-full">
                + Create Trip
              </Button>
            </a>
            <a href="/my-trips">
              <Button variant="outline" className=" rounded-full">
                My Trips
              </Button>
            </a>
            <Popover>
              <PopoverTrigger>
                <img
                  src={profilePic}
                  alt="profile pic"
                  className="h-[35px] w-[35px] rounded-full"
                />
              </PopoverTrigger>
              <PopoverContent>
                <h2
                  className=" cursor-pointer"
                  onClick={() => {
                    googleLogout();
                    localStorage.clear();
                    window.location.reload();
                  }}
                >
                  Logout
                </h2>
              </PopoverContent>
            </Popover>
          </div>
        ) : (
          <Button onClick={() => setOpenDialog(true)}>Sign In</Button>
        )}
      </div>
      <Dialog open={openDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogDescription>
              <img src="/logo.svg" alt="logo" />
              <h2 className=" font-bold text-lg mt-7">Sign in with Google</h2>
              <p>Sign in to the app with google authentication securely</p>
              <Button
                onClick={login}
                className=" w-full mt-5 flex gap-4 items-center"
              >
                <FcGoogle className=" h-7 w-7" /> Sign in with Google
              </Button>
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Header;
