
import { connect } from 'react-redux';

const mapStateToProps = (_, { location, params }) => ({
    pathname: location.pathname,
    id: params.id,
});

export default function connectMain(view) {
    return connect(mapStateToProps)(view);
}
