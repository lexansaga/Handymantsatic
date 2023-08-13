const Stacks = () => {
    <Stack.Navigator
        screenOptions={{
            headerShown: false,
            headerStyle: {
                backgroundColor: "#ffffff",
            },
            cardStyle: { backgroundColor: "#fff" },
            contentStyle: {
                backgroundColor: "#FFFFFF",
            },
        }}
    >
        <Stack.Screen
            name="Signin"
            component={Signin}
            // options={{ title: "Signin", header: () => <Header /> }}
            options={{
                title: "Signin",
                header: () => {
                    null;
                },
            }}
        />
        <Stack.Screen
            name="Signup"
            component={Signup}
            options={{ title: "Signup" }}
        />
        <Stack.Screen
            name="ForgotPassword"
            component={ForgotPassword}
            options={{ title: "ForgotPassword" }}
        />
        <Stack.Screen
            name="Home"
            component={Home}
            options={{ title: "Home" }}
        />
        <Stack.Screen
            name="Client"
            component={Client}
            options={{ title: "Client" }}
        />
        <Stack.Screen
            name="ServiceProvider"
            component={ServiceProvider}
            options={{ title: "ServiceProvider" }}
        />

        <Stack.Screen
            name="Chat"
            component={Chat}
            options={{ title: "chat" }}
        />

        {/* Client Screens */}
        <Stack.Screen
            name="ClientHome"
            component={ClientHome}
            options={{ title: "ClientHome" }}
        />
        <Stack.Screen
            name="ClientHireForm"
            component={ClientHireForm}
            // options={{ title: "Signin", header: () => <Header /> }}
        />
        <Stack.Screen
            name="ClientServiceFeed"
            component={ClientServiceFeeds}
            options={{ title: "ClientServiceFeed" }}
        />
        <Stack.Screen
            name="ClientSuccessBook"
            component={ClientSuccessBook}
            options={{ title: "ClientSuccessBook" }}
        />

        {/* Service Provider Screens */}
        <Stack.Screen
            name="ServiceProviderHome"
            component={ServiceProviderHome}
            options={{ title: "ServiceProviderHome" }}
        />
        <Stack.Screen
            name="ServiceProviderFeeds"
            component={ServiceProviderFeeds}
            options={{ title: "ServiceProviderFeeds" }}
        />

        <Stack.Screen
            name="ServiceProviderPostView"
            component={ServiceProviderPostView}
            options={{ title: "ServiceProviderPostView" }}
        />
        <Stack.Screen
            name="ServiceProviderPostAJob"
            component={ServiceProviderPostAJob}
            options={{ title: "ServiceProviderPostAJob" }}
        />
    </Stack.Navigator>;
};

export { Stacks };
