import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { Tab, TabList, TabPanel, Tabs } from "react-tabs";
import { yupResolver } from "@hookform/resolvers/yup";
import { LazyLoadImage } from "react-lazy-load-image-component";
import * as yup from "yup";
import "./style.scss";
import {
  useGetAccountQuery,
  useUpdateAccountMutation,
  useUpdatePasswordAccountMutation,
  useUploadPhotoMutation,
} from "../../redux/queries/account";
import { userImage } from "../../utils/getImage";
import Loading from "../../components/shared/Loading";
import { message } from "antd";
import { useDispatch } from "react-redux";
import Cookies from "js-cookie";
import { TOKEN, USER } from "../../constants";
import { removeAuth } from "../../redux/slices/auth";

const schema = yup
  .object({
    currentPassword: yup.string().required(),
    newPassword: yup.string().required(),
    newPasswordAgain: yup
      .string()
      .oneOf([yup.ref("newPassword"), null], "Passwords must match"),
  })
  .required();

const AccountPage = () => {
  const dispatch = useDispatch();

  const [photo, setPhoto] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [passwordEditLoading, setPasswordEditLoading] = useState(false);
  const [photoLoading, SetPhotoLoading] = useState(false);
  const [userData, setUserData] = useState({});

  const { data, isFetching, refetch } = useGetAccountQuery();

  const [uploadPhoto] = useUploadPhotoMutation();
  const [updateUserData] = useUpdateAccountMutation();
  const [updatePasswordUser] = useUpdatePasswordAccountMutation();

  useEffect(() => {
    setUserData(data);
    setPhoto(data?.photo);
  }, [data]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data) => {
    let { currentPassword, newPassword, username } = data;
    const body = {
      currentPassword,
      newPassword,
      username,
    };
    try {
      setPasswordEditLoading(true);
      await updatePasswordUser(body).unwrap();
      message.success("Password updated successfully");
      refetch();
      data.currentPassword = "";
      data.newPassword = "";
      data.newPasswordAgain = "";
      data.username = "";
    } finally {
      setPasswordEditLoading(false);
    }
  };

  const handleFileChange = async (e) => {
    const formData = new FormData();
    const file = e.target.files[0];
    formData.append("file", file);
    try {
      SetPhotoLoading(true);
      const { data } = await uploadPhoto(formData);
      setPhoto(data);
      refetch();
    } finally {
      SetPhotoLoading(false);
    }
  };

  const editUserData = async (e) => {
    e.preventDefault();
    const fields = e.target.fields.value.split(" ");
    const values = {
      firstName: e.target.firstName.value,
      lastName: e.target.lastName.value,
      username: e.target.username.value,
      fields: fields,
      info: e.target.info.value,
      phoneNumber: e.target.phoneNumber.value,
      birthday: "2007-10-21",
      address: e.target.address.value,
      email: e.target.email.value,
      github: e.target.github.value,
      linkedin: e.target.linkedin.value,
      telegram: e.target.telegram.value,
      instagram: e.target.instagram.value,
      youtube: e.target.youtube.value,
    };

    try {
      setEditLoading(true);
      await updateUserData(values);
      refetch();
      message.success("Updated user data😊");
    } finally {
      setEditLoading(false);
    }
  };

  const heandleLogOut = () => {
    Cookies.remove(TOKEN);
    localStorage.removeItem(USER);
    dispatch(removeAuth());
  };

  return (
    <section>
      <div className="container" style={{ padding: "150px 0 100px 0" }}>
        {isFetching ? (
          <Loading />
        ) : (
          <Tabs className="react-tabs">
            <TabList className="react-tabs__tab-list">
              <Tab className="react-tabs__tab">Profile</Tab>
              <Tab className="react-tabs__tab">Password Change</Tab>
            </TabList>

            <TabPanel className="react-tabs__tab-panel">
              <div className="profile__settings">
                <div className="profile__settings__file">
                  <label htmlFor="fileInput" className="file-label">
                    {photo ? "Change photo" : "Upload photo "}
                  </label>
                  <input
                    className="file__upload"
                    type="file"
                    id="fileInput"
                    onChange={handleFileChange}
                    style={{ display: "none" }}
                  />
                  {photoLoading ? (
                    <LazyLoadImage
                      effect="blur"
                      className="file__img"
                      src="https://upload.wikimedia.org/wikipedia/commons/c/c7/Loading_2.gif?20170503175831"
                      alt="gif"
                    />
                  ) : photo ? (
                    <LazyLoadImage
                      effect="blur"
                      className="file__img"
                      src={userImage(userData?.photo)}
                      alt="user"
                    />
                  ) : (
                    <LazyLoadImage
                      effect="blur"
                      className="file__img"
                      src="https://t4.ftcdn.net/jpg/04/70/29/97/360_F_470299797_UD0eoVMMSUbHCcNJCdv2t8B2g1GVqYgs.jpg"
                      alt="NoPhoto"
                    />
                  )}
                </div>

                <form
                  className="profile__settings__form"
                  onSubmit={editUserData}
                >
                  <div>
                    <label className="profile__settings__form__title">
                      First name
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      defaultValue={userData?.firstName}
                      className="profile__settings__form__input"
                    />
                  </div>

                  <div>
                    <label className="profile__settings__form__title">
                      Last name
                    </label>
                    <input
                      name="lastName"
                      defaultValue={userData?.lastName}
                      type="text"
                      className="profile__settings__form__input"
                    />
                  </div>

                  <div>
                    <label className="profile__settings__form__title">
                      Username
                    </label>
                    <input
                      type="text"
                      name="username"
                      defaultValue={userData?.username}
                      className="profile__settings__form__input"
                    />
                  </div>

                  <div>
                    <label className="profile__settings__form__title">
                      Fields
                    </label>
                    <input
                      type="text"
                      name="fields"
                      defaultValue={userData?.fields}
                      className="profile__settings__form__input"
                    />
                  </div>

                  <div>
                    <label className="profile__settings__form__title">
                      Phone number
                    </label>
                    <input
                      type="text"
                      name="phoneNumber"
                      defaultValue={userData?.phoneNumber}
                      className="profile__settings__form__input"
                    />
                  </div>

                  {/* <div>
                    <label className="profile__settings__form__title">
                      Birthday
                    </label>
                    <input
                      type="date"
                      name="birthday"
                      onChange={(e) => setDateUser(e.target.value)}
                      value="2007-10-21"
                      className="profile__settings__form__input"
                    />
                  </div> */}

                  <div>
                    <label className="profile__settings__form__title">
                      Email
                    </label>
                    <input
                      name="email"
                      defaultValue={userData?.email}
                      type="email"
                      className="profile__settings__form__input"
                    />
                  </div>

                  <div>
                    <label className="profile__settings__form__title">
                      Info
                    </label>
                    <textarea
                      rows={5}
                      name="info"
                      defaultValue={userData?.info}
                      type="text"
                      className="profile__settings__form__input"
                    />
                  </div>

                  <div>
                    <label className="profile__settings__form__title">
                      Address
                    </label>
                    <input
                      name="address"
                      defaultValue={userData?.address}
                      type="text"
                      className="profile__settings__form__input"
                    />
                  </div>

                  <div>
                    <label className="profile__settings__form__title">
                      Github
                    </label>
                    <input
                      name="github"
                      defaultValue={userData?.github}
                      type="text"
                      className="profile__settings__form__input"
                    />
                  </div>

                  <div>
                    <label className="profile__settings__form__title">
                      Linkedin
                    </label>
                    <input
                      name="linkedin"
                      defaultValue={userData?.linkedin}
                      type="text"
                      className="profile__settings__form__input"
                    />
                  </div>

                  <div>
                    <label className="profile__settings__form__title">
                      Telegram
                    </label>
                    <input
                      name="telegram"
                      defaultValue={userData?.telegram}
                      type="text"
                      className="profile__settings__form__input"
                    />
                  </div>

                  <div>
                    <label className="profile__settings__form__title">
                      Instagram
                    </label>
                    <input
                      name="instagram"
                      defaultValue={userData?.instagram}
                      type="text"
                      className="profile__settings__form__input"
                    />
                  </div>

                  <div>
                    <label className="profile__settings__form__title">
                      Youtube
                    </label>
                    <input
                      name="youtube"
                      defaultValue={userData?.youtube}
                      type="text"
                      className="profile__settings__form__input"
                    />
                  </div>

                  <div>
                    <label className="profile__settings__form__title">
                      Facebook
                    </label>
                    <input
                      name="facebook"
                      defaultValue={userData?.facebook}
                      type="text"
                      className="profile__settings__form__input"
                    />
                  </div>

                  <div className="send">
                    {editLoading ? (
                      <button disabled className="send__button send__disabled">
                        Loading...
                      </button>
                    ) : (
                      <button type="submit" className="send__button">
                        Save
                      </button>
                    )}
                  </div>
                </form>
              </div>
            </TabPanel>

            <TabPanel className="react-tabs__tab-panel">
              <form onSubmit={handleSubmit(onSubmit)}>
                <div style={{ marginTop: "30px" }}>
                  <label className="profile__settings__form__title">
                    Username
                  </label>
                  <input
                    type="text"
                    className="profile__settings__form__input"
                    {...register("username")}
                  />
                </div>

                <div style={{ marginTop: "30px" }}>
                  <label className="profile__settings__form__title">
                    Current password
                  </label>
                  <input
                    type="password"
                    className="profile__settings__form__input"
                    {...register("currentPassword")}
                  />
                </div>

                <div style={{ marginTop: "30px" }}>
                  <label className="profile__settings__form__title">
                    New password
                  </label>
                  <input
                    {...register("newPassword")}
                    type="password"
                    className="profile__settings__form__input"
                  />
                </div>

                <div style={{ marginTop: "30px" }}>
                  <label className="profile__settings__form__title">
                    Conifirm new password
                  </label>
                  <input
                    {...register("newPasswordAgain")}
                    type="password"
                    className="profile__settings__form__input"
                  />
                  <p className="error-message">
                    {errors.newPasswordAgain?.message}
                  </p>
                </div>

                <div className="send">
                  {passwordEditLoading ? (
                    <button disabled className="send__button send__disabled">
                      Loading...
                    </button>
                  ) : (
                    <button type="submit" className="send__button">
                      Save
                    </button>
                  )}
                </div>
              </form>
            </TabPanel>
          </Tabs>
        )}

        <button
          style={{ marginTop: "40px" }}
          onClick={heandleLogOut}
          className="auth__button"
        >
          Logout
        </button>
      </div>
    </section>
  );
};

export default AccountPage;
