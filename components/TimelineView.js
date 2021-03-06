import { Component } from 'react';
import marked from 'marked';
import format from '../components/format';
import isToday from 'date-fns/is_today';
import isPast from 'date-fns/is_past';
import parse from 'date-fns/parse';
import Button from './Button';
import Circle from './Circle';

const MOBILE = 'max-width: 400px';

const trans = {
  Monday: 'Man',
  Tuesday: 'Tirs',
  Wednesday: 'Ons',
  Thursday: 'Tors',
  Friday: 'Fre',
  Saturday: 'Lør',
  Sunday: 'Søn'
};

const Timeline = ({ items, selectedIndex, onChangeItem }) => (
  <div>
    <div className="bar" />
    {items.map((hour, index) => {
      const selected = index === selectedIndex;
      return (
        <Circle
          key={index}
          onClick={() => onChangeItem(index)}
          size={40}
          selected={selected}
          style={{
            display: 'block',
            transform: `translateX(${(hour - 8) / 24 * 700}px) scale(${selected
              ? 1.5
              : 1})`
          }}
        >
          {hour}
        </Circle>
      );
    })}

    <style jsx>
      {
        `
      div {
        flex: 1;
        display: flex;
        flex-direction: row;
        position: relative;
        align-items: center;
      }

      .bar {
        position: absolute;
        content: '';
        height: 6px;
        background: #eee;
        width: 100%;
        top: 20px;
        border-radius: 3px;
      }
    `
      }
    </style>
  </div>
);

const Event = ({ event, selected }) => (
  <div
    className="root"
    style={{
      borderLeftWidth: '3px',
      borderLeftStyle: 'solid',
      borderLeftColor: selected ? '#b11b11' : 'transparent'
    }}
  >
    <h2
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
      {event.title}
      <time style={{ color: '#999' }}>
        {format(event.startsAt, 'HH:mm')}
        {event.endsAt && <span> – {format(event.endsAt, 'HH:mm')}</span>}
      </time>
    </h2>

    <div style={{ padding: '20px 0' }} dangerouslySetInnerHTML={{ __html: marked(event.description) }} />

    {event.abakus &&
      <Button href={event.abakus}>Arrangement på abakus.no</Button>}
    {event.facebook &&
      <Button facebook href={event.facebook}>Event på Facebook</Button>}

    <style jsx>
      {
        `
      .root {
        margin: 20px;
        padding: 20px;
      }

      :global(p) {
        margin-bottom: 10px;
      }

      @media (max-width: 400px) {
        .root {
          border-left: 0;
          border-top: 3px solid #b11b11;
        }
      }
    `
      }
    </style>
  </div>
);

function getNextEventIndex(events) {
  const timeToCompare = new Date().getTime();
  const datesToCompare = events.map(event => event.startsAt);

  for (let index = 0; index < datesToCompare.length; index++) {
    let distance = parse(datesToCompare[index]).getTime() - timeToCompare;
    if (distance >= 0) {
      return index;
    }
  }

  return 0;
}

class Day extends Component {
  state = {
    selectedIndex: getNextEventIndex(this.props.events),
    showAll: isToday(this.props.events[0].startsAt)
  };

  render() {
    const { day, events } = this.props;

    const event = events[this.state.selectedIndex];
    const date = event.startsAt;

    const renderedEvent = this.state.showAll
      ? <div>
          {events.map((event, i) => (
            <Event
              key={i}
              event={event}
              selected={i === this.state.selectedIndex}
            />
          ))}
        </div>
      : <Event event={event} selected />;

    const toggleShowAll = () =>
      this.setState(state => ({ showAll: !state.showAll }));

    return (
      <div
        className={
          isToday(date) ? 'day today' : isPast(date) ? 'day past' : 'day'
        }
      >
        <div className="date">
          <h2 className="title">{format(date, 'ddd')}</h2>
          <span style={{ color: '#b11b11' }}>{format(date, 'DD.MM')}</span>
          {events.length > 1 &&
            <button
              onClick={toggleShowAll}
              style={{
                border: 0,
                fontSize: '14px',
                cursor: 'pointer',
                background: 'transparent',
                marginTop: 10,
                color: '#888'
              }}
            >
              Vis {this.state.showAll ? 'én' : 'alt'}
            </button>}
        </div>

        <div className="right">
          <Timeline
            items={events.map(event => format(event.startsAt, 'H'))}
            selectedIndex={this.state.selectedIndex}
            onChangeItem={selectedIndex => this.setState({ selectedIndex })}
          />

          {renderedEvent}
        </div>

        <style jsx>
          {
            `
          .day {
            width: 100%;
            display: flex;
            flex-direction: row;
            align-items: flex-start;
            background: white;
            margin-top: 25px;
            padding: 30px 20px;
            box-shadow: 0px 4px 6px rgba(0, 0, 0, .1);
          }

          .today {
            border: 4px solid #efdbc2;
          }

          .past {
            opacity: 0.3;
            filter: blur(6px);
          }

          .past:hover {
            opacity: 1;
            filter: blur(0);
          }

          @media (max-width: 400px) {
            .day {
              flex-direction: column;
            }
          }

          .date {
            text-align: center;
            line-height: 30px;
            padding: 0 40px 20px 20px;
            display: flex;
            flex-direction: column;
          }

          .right {
            width: 100%;
          }

          .title {
            width: 50px;
          }

        `
          }
        </style>
      </div>
    );
  }
}

const TimelineView = ({ events }) => (
  <div className="root">
    {Object.entries(events)
      .map(([day, events]) => <Day key={day} day={day} events={events} />)}

    <style jsx>
      {
        `
      .root {
        width: 100%;
        padding: 20px 0 40px 0;
      }
    `
      }
    </style>
  </div>
);

export default TimelineView;
