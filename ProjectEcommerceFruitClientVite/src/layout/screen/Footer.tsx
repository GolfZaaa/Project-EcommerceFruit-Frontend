import MyContent from "../../component/MyContent";
import { imageLocal, pathImages } from "../../constants/RoutePath";
// import logokru from "../../image/krulogo.png";
import { useStore } from "../../store/store";

export default function Footer() {
  const { systemSetting } = useStore().systemSettingStore;

  if (!systemSetting || systemSetting.length === 0) {
    return null;
  }

  return (
    <>
      <footer className="bg-white FontPublic">
        <div className="border border-black -mb-12 mt-8"></div>
        <footer className="w-full pt-10 mt-10 pl-5 pr-5">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="mx-auto">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="flex items-center gap-4 md:gap-6">
                  {systemSetting[0].image ? (
                    <img
                      src={
                        systemSetting[0]?.image
                          ? pathImages.image_web + systemSetting[0]?.image
                          : "https://png.pngtree.com/png-clipart/20230917/original/pngtree-no-image-available-icon-flatvector-illustration-blank-avatar-modern-vector-png-image_12323065.png"
                      }
                      className="w-24 h-24 md:w-36 md:h-36 rounded-full object-cover"
                      alt="image"
                    />
                  ) : (
                    <img
                      src={imageLocal.logoKru}
                      className="w-32 h-28 md:h-44  object-cover"
                      alt="image"
                    />
                  )}
                  <div>
                    {systemSetting[0].webName ? (
                      <div>
                        <p
                          className="text-lg md:text-xl font-semibold underline"
                          style={{ color: "#01c446" }}
                        >
                          <MyContent
                            name={systemSetting[0]?.webName}
                            fontSize="large"
                          />
                        </p>
                        <p
                          className="text-sm md:text-base pt-3 font-semibold"
                          style={{ color: "#8b8484" }}
                        >
                          <MyContent
                            name={"อำเภอทองผาภูมิ จังหวัดกาญจนบุรี"}
                            fontSize="littlenormal"
                          />
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p
                          className="text-lg md:text-xl font-semibold underline"
                          style={{ color: "#01c446" }}
                        >
                          <MyContent
                            name={"มหาวิทยาลัยราชภัฏกาญจนบุรี"}
                            fontSize="normal"
                          />
                        </p>
                        <p
                          className="text-sm md:text-base pt-3 font-semibold"
                          style={{ color: "#8b8484" }}
                        >
                          <MyContent
                            name={"Kanchanaburi Rajabhat University"}
                            fontSize="small"
                          />
                        </p>
                      </div>
                    )}
                  </div>
                </div>

                {systemSetting[0].description ? (
                  <div className="text-center md:text-left md:ml-6 md:w-[50%]">
                    <p
                      className="text-sm md:text-base font-normal"
                      style={{ color: "#8b8484" }}
                    >
                      <MyContent
                        name={systemSetting[0]?.description}
                        fontSize="small"
                      />
                    </p>
                  </div>
                ) : (
                  <div className="text-center md:text-left md:ml-6 md:w-[50%]">
                    <p
                      className="text-sm md:text-base font-normal"
                      style={{ color: "#8b8484" }}
                    >
                      <p className="pb-2">
                        <MyContent
                          name={
                            "ที่อยู่ : 70 ม.4 ต.หนองบัว อ.เมืองกาญจนบุรี 71190"
                          }
                          fontSize="small"
                        />
                      </p>
                      <p className="pb-2">
                        <MyContent
                          name={"โทร : 034-534059-60"}
                          fontSize="small"
                        />
                      </p>

                      <p className="pb-2">
                        <MyContent name={"Fax : 034-534057"} fontSize="small" />
                      </p>

                      <p className="pb-2">
                        <MyContent
                          name={"Email : kru@kru.ac.th"}
                          fontSize="small"
                        />
                      </p>
                    </p>
                  </div>
                )}
              </div>
              <div className="max-w-3xl mx-auto mt-6">
                <ul className="text-lg flex items-center justify-center flex-col gap-7 md:flex-row md:gap-12 transition-all duration-500 py-5 mb-10 border-b border-gray-200"></ul>
              </div>
            </div>
          </div>
        </footer>
      </footer>
    </>
  );
}
