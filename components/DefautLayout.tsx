import React, { useEffect, useState } from "react";
import Head from 'next/head';
import { Badge, ConfigProvider, Layout, Menu, MenuProps } from "antd";
import { faSignOut, faSignIn, faHome, faCalendarAlt, faPeopleRoof, faShield, faInfo } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/router";
import { useSession, signOut } from "next-auth/react";
import nProgress from "nprogress";
import { Image } from "antd";
import useSWR from 'swr';
import { BackendApiUrl } from '@/functions/BackendApiUrl'; 
import { GetUserRole } from '@/interface/GetRoleOptionInterface'; 
import { useSwrFetcherWithAccessToken } from "@/functions/useSwrFetcherWithAccessToken";
import { User } from "next-auth";
import ChangeRoleModal from "@/components/Modals/ChangeRoleModal";

const { Content, Sider } = Layout;

const sidebarBackgroundColor = '#380356';
const sidebarMenuSelectedItemBackgroundColor = '#6B0078';

interface UnreadNotif{
    total: number;
}

const DefaultLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const router = useRouter();
    const { data: session, status } = useSession();
    const user = session?.user as User;
    const swrFetcher = useSwrFetcherWithAccessToken();
    const [selected, setSelected] = useState([router.pathname]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [displayUserName, setDisplayUserName] = useState<string>(user?.name || "");
    

    // Fetch user roles
    const userId = user?.id;
    const { data: rolesData, error } = useSWR<GetUserRole>(`${BackendApiUrl.getUserRole}?UserId=${userId}`, swrFetcher);
    const { data: unreadNotifData } = useSWR<UnreadNotif>(`${BackendApiUrl.getNotificationUnread}?UserId=${userId}`, swrFetcher);

    const [unreadNotif, setUnreadNotif] = useState<number>(0); // Local state to manage unread notifications

    // Update unread notifications when data is fetched
    useEffect(() => {
        if (unreadNotifData) {
            setUnreadNotif(unreadNotifData.total); // Assuming unreadNotifData has a 'Total' field
        }
    }, [unreadNotifData]); 

    const handleDirectNotif = () => {
        router.push('/notification')
    }

    useEffect(() => {
        if (user) {
            const role = user?.role?.[0];
   
            if (role === "Student" || role === "StudentOrganization" || role === "Staff" || role === "Lecturer") {
                setSelected(['/dashboardUser']);
            } else if (role === "SSO") {
                setSelected(['/dashboardApprover']);
            } else if (role === "SLC" || role === "LSC" || role === "BM") {
                setSelected(['/dashboardApprover']);
            } else if (role === "SuperAdmin") {
                setSelected(['/dashboardAdmin']);
            }
        }
    }, [user]);
   

    useEffect(() => {
        if (user?.role?.[0] === "StudentOrganization" || user?.role?.[0] === "Staff"){
            const fetchDisplayName = async () => {
                try {
                    const response = await fetch(`${BackendApiUrl.getDisplayName}?UserId=${userId}&RoleName=${user?.role?.[0]}`);
                    const data = await response.json();
                    if (data && data.name) {
                        setDisplayUserName(data.name); // Update with fetched display name
                    } else {
                        setDisplayUserName(session?.user?.name || ""); // Fallback
                    }
                } catch (error) {
                    console.error("Error fetching display name:", error);
                    setDisplayUserName(session?.user?.name || ""); // Fallback in case of error
                }
            };

            fetchDisplayName();
        } else {
            // Default display name for other roles
            setDisplayUserName(session?.user?.name || "");
        }
    }, [userId, rolesData, session?.user?.name, user?.role]);

    if (error) {
        console.error("Error fetching roles:", error);
    }

    const getMenu = () => {
        const menu: MenuProps['items'] = [];
        const role = user?.role?.[0];
        const roleKey = () => {
            if (role === "Student" || role === "StudentOrganization" || role === "Staff" || role === "Lecturer") {
                return '/dashboardUser';
            } else if(role === "SuperAdmin") {
                return '/dashboardAdmin';
            }else {
                return '/dashboardApprover';
            }
        };

        if (role) {
            menu.push({
                key: roleKey(),
                label: 'Dashboard',
                icon: <FontAwesomeIcon icon={faHome} className="mr-[10px]" />,
                onClick: () => router.push('/')
            });

            if (role === "Student" || role === "StudentOrganization" || role === "Staff" || role === "Lecturer") {
                menu.push({
                    key: '/ongoing',
                    label: 'Ongoing',
                    icon: <FontAwesomeIcon icon={faHome} className="mr-[10px]" />,
                    onClick: () => router.push('/ongoing')
                });
            } else if (role === "SSO") {
                menu.push({
                    key: '/approverHistory',
                    label: 'History',
                    icon: <FontAwesomeIcon icon={faCalendarAlt} className="mr-[11px]" />,
                    onClick: () => router.push('/approverHistory')
                });
            } else if (role === "SLC" || role === "LSC" || role === "BM") {
                menu.push({
                    key: '/approverHistory',
                    label: 'History',
                    icon: <FontAwesomeIcon icon={faCalendarAlt} className="mr-[11px]" />,
                    onClick: () => router.push('/approverHistory')
                });
                menu.push({
                    key: '/manage',
                    label: 'Manage',
                    icon: <FontAwesomeIcon icon={faPeopleRoof} className="mr-[9px]" />,
                    onClick: () => router.push('/manage')
                });
            } else if (role === "SuperAdmin") {
                menu.push({
                    key: '/manage',
                    label: 'Manage',
                    icon: <FontAwesomeIcon icon={faPeopleRoof} className="mr-[9px]" />,
                    onClick: () => router.push('/manage')
                });
                menu.push({
                    key: '/blocker',
                    label: 'Blocker',
                    icon: <FontAwesomeIcon icon={faShield} className="mr-[12px]" />,
                    onClick: () => router.push('/blocker')
                });
            }
        }
        return menu;
    };

    const getLogOut = () => {
        const authmenu: MenuProps['items'] = [];
        if (status === 'authenticated') {
            authmenu.push({
                key: '/signOut',
                label: 'Log out',
                icon: <FontAwesomeIcon icon={faSignOut} className="mr-[12px]" />,
                onClick: () => {
                    nProgress.start();
                    signOut({ callbackUrl: '/', redirect: true }).then(() => { nProgress.done(); });
                }
            });
        } else {
            authmenu.push({
                key: '/login',
                label: 'Sign in',
                icon: <FontAwesomeIcon icon={faSignIn} className="mr-[12px]" />,
                onClick: () => {
                    nProgress.start();
                    router.push('/login');
                }
            });
        }
        return authmenu;
    };




    // Open/Close modal
    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <ConfigProvider theme={{
            components: {
                Layout: {
                    colorBgHeader: sidebarBackgroundColor,
                    colorBgBody: "#000000"
                }
            }
        }}>
            <Layout className="min-h-screen">
                <Head>
                    <meta key="meta-charset" charSet="utf-8" />
                    <meta key="meta-viewport" name="viewport" content="width=device-width, initial-scale=1" />
                    <link key="main-logo" rel="icon" href="/main-logo.ico" />
                </Head>

                <Sider width={300} className="pb-24 hidden lg:block p-6">
                    <div className="h-12">
                        <Image preview={false} src="/Assets/images/logo-side-bar.png" alt="Roomify Logo" width={170} />
                        <div className="bg-white rounded-2xl h-56 my-6 shadow-gray-600 shadow-lg relative">
                            <div className="px-6 py-6 max-w-sm">
                                <p className="text-xl font-semibold">Hi,</p>
                                <p className="text-4xl font-bold overflow-wrap break-words">{displayUserName}</p>
                            </div>
                            <button 
                                onClick={openModal}
                                className="absolute bottom-4 right-4 flex items-center justify-center text-white bg-[#EB8317] border-4 border-[#d68530] px-4 py-2 rounded-lg font-semibold hover:to-blue-950"
                            >
                                Change Role
                            </button>
                            <button
                                onClick={handleDirectNotif}
                                className="absolute bottom-4 left-4 flex items-center justify-center text-white border-2 px-4 py-2 font-semibold bg-purple-950 border-purple-800 rounded-full w-9 h-9"
                            >
                                <div className="relative flex items-center justify-center">
                                    <Badge count={unreadNotif} overflowCount={999} style={{ position: 'absolute', top: -6, right: -15 }}>
                                        <FontAwesomeIcon icon={faInfo} className="text-white" />
                                    </Badge>
                                </div>
                            </button>

                        </div>
                        <ConfigProvider theme={{
                            components: {
                                Menu: {
                                    colorItemBg: sidebarBackgroundColor,
                                    colorItemBgSelected: sidebarMenuSelectedItemBackgroundColor,
                                    radiusItem: 100,
                                    colorActiveBarBorderSize: 0,
                                    itemMarginInline: 0,
                                }
                            }
                        }}>
                            <Menu theme="dark" mode="vertical" items={getMenu()}
                                selectedKeys={selected} onSelect={e => setSelected(e.selectedKeys)} style={{ fontSize: 16 }} />
                            <Menu theme="dark" mode="vertical" items={getLogOut()}
                                selectedKeys={selected} onSelect={e => setSelected(e.selectedKeys)} style={{ fontSize: 16 }} className="absolute bottom-6" />
                        </ConfigProvider>
                    </div>
                </Sider>
                <Layout>
                    <Content className="m-5 p-8 bg-[#1F1E1E]">
                        {children}
                    </Content>
                </Layout>

                {/* ChangeRoleModal Component */}
                <ChangeRoleModal
                    isOpen={isModalOpen}
                    onClose={closeModal}
                />
            </Layout>
        </ConfigProvider>
    );
};

export const WithDefaultLayout = (page: React.ReactElement) => <DefaultLayout>{page}</DefaultLayout>;
