
import { connect } from 'react-redux';

const mapStateToProps = (_, { params, router }) => ({
    id: params.id,
    replace: router.replace,
});

export default function connectDetail(view) {
    return connect(mapStateToProps)(view);
}
