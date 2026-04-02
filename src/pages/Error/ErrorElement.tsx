import { useRouteError, isRouteErrorResponse, Link } from "react-router-dom";

function ErrorElement() {
    const error = useRouteError();

    let title = "Something went wrong";
    let message = "An unexpected error occurred.";
    let status = "";

    if (isRouteErrorResponse(error)) {
        status = error.status.toString();
        message = error.statusText || message;
    } else if (error instanceof Error) {
        message = error.message;
    }

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-[#f8fafc] to-[#e2e8f0] text-gray-800 px-6">

            <div className="text-center max-w-md">

                {status && (
                    <h1 className="text-6xl font-bold text-red-500 mb-4">
                        {status}
                    </h1>
                )}

                <h2 className="text-2xl font-semibold mb-3">
                    {title}
                </h2>

                <p className="text-gray-600 mb-6">
                    {message}
                </p>

                <Link
                    to="/"
                    className="inline-block px-5 py-2 bg-black text-white rounded-lg hover:bg-gray-800 transition"
                >
                    Go back home
                </Link>
            </div>

        </div>
    );
}

export default ErrorElement;