import React from 'react';

class CardHeader extends React.Component {

    static propTypes = {
        // TODO would add icon
        title: React.PropTypes.string,
        count: React.PropTypes.number,
    }

    getStyles() {
        return {
            title: {
                fontSize: 24,
                lineHeight: '36px',
            },
            'countContainer': {
                textAlign: 'right',
            },
            'count': {
                fontSize: 24,
            },
        };
    }

    render() {
        const styles = this.getStyles();
        return (
            <header>
                <div className="row">
                    <div className="col-xs">
                        <span style={styles.title}>{this.props.title}</span>
                    </div>
                    <div className="col-xs">
                        <div style={styles.countContainer}>
                            <span style={styles.count}>{this.props.count}</span>
                        </div>
                    </div>
                </div>
            </header>
        );
    }
}

export default CardHeader;
