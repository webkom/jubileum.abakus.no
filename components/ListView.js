import { Component } from 'react';
import marked from 'marked';
import format from '../components/format';
import parse from 'date-fns/parse';
import Link from 'next/link';
import Box from './Box';
import Button from './Button';

const trans = {
  'Monday': 'Mandag',
  'Tuesday': 'Tirsdag',
  'Wednesday': 'Onsdag',
  'Thursday': 'Torsdag',
  'Friday': 'Fredag',
  'Saturday': 'Lørdag',
  'Sunday': 'Søndag'
};

const expand = (state) => ({
  expanded: !state.expanded
});

class Event extends Component {
  state = {
    expanded: false
  };

  render() {
    const { event } = this.props;
    return (
      <div className="box">
        <div>
          <a onClick={() => this.setState(expand)}>
            <h3 className="eventTitle">
              {event.title} {this.state.expanded ? '\u25BF' : '\u25B9'}
            </h3>
          </a>

          {this.state.expanded && (
            <div style={{ paddingTop: 20 }}>
              <div>
                <time className="when">
                  {format(event.startsAt, 'HH:mm')}
                  {event.endsAt && <span> &ndash; {format(event.endsAt, 'HH:mm')}</span>}
                </time>
              </div>

              <div style={{ padding: '20px 0' }} dangerouslySetInnerHTML={{ __html: marked(event.description) }} />

              <div style={{ paddingTop: 20 }}>
                {event.abakus && <Button href={event.abakus}>Arrangement på Abakus.no &rarr;</Button>}
                {event.facebook &&
                  <Button facebook href={event.facebook}>Event på Facebook</Button>}
              </div>
            </div>
          )}
        </div>

        <style jsx>{`
          .eventTitle {
            font-size: 22px;
          }

          .box {
            padding: 20px;
            background: white;
            box-shadow: 0 0 10px #eee;
            border: 1px solid #ccc;
            margin-bottom: 20px;
            border-right: 3px solid #b11b11;
          }

          .center {
            display: flex;
            flex-direction: column;
            justify-content: flex-start;
          }

          .when {
            font-size: 18px;
            color: #aaa;
          }

          .button:active {
            transform: translateY(1px);
          }
        `}
        </style>
      </div>
    );
  }
}

export default ({ events }) => {
  return (
    <div className="root">
      {Object.entries(events).map(([day, events]) => (
        <div key={day} className="day">
          <h2 className="title">{format(events[0].startsAt, 'dddd DD.MM')}</h2>
          {events.map((event) => (
            <Event event={event} key={event.id} />
          ))}
        </div>
      ))}

      <style jsx>{`
        .root  {
          width: 100%;
          padding: 20px 0;
        }

        .day {
          padding: 10px 20px 10px 10px;
        }

        .title {
          padding: 15px 20px;
          color: #888;
          letter-spacing: 2px;
          font-size: 20px;
          font-weight: 400;
          text-transform: uppercase;
        }
      `}
      </style>
    </div>
  );
};
